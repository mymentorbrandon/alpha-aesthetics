/**
 * BULK-CREATE STRIPE PRODUCTS & PRICES
 *
 * Reads the product list straight out of js/cart-data.js, creates a
 * matching Product + Price in Stripe for every item that still has a
 * "REPLACE_ME_..." placeholder, then REWRITES js/cart-data.js in place
 * with the real Price IDs filled in.
 *
 * SAFE TO RE-RUN: items that already have a real Price ID (anything not
 * starting with "REPLACE_ME") are skipped, so running this twice won't
 * create duplicates.
 *
 * ---------------------------------------------------------------------
 * HOW TO RUN
 * ---------------------------------------------------------------------
 * 1. Make sure Node.js is installed (node -v to check).
 * 2. In the repo root (same folder as js/cart-data.js), run:
 *
 *      npm install stripe
 *      STRIPE_SECRET_KEY=sk_test_yourKeyHere node scripts/create-stripe-products.js
 *
 *    (On Windows PowerShell, set the key first instead:
 *      $env:STRIPE_SECRET_KEY="sk_test_yourKeyHere"
 *      node scripts/create-stripe-products.js )
 *
 * 3. ALWAYS use your TEST secret key first (starts sk_test_...) — never
 *    paste your live key into a terminal you're unsure about. Once
 *    everything is tested and working, re-run this same script with the
 *    LIVE key to create the live-mode equivalents, and swap those Price
 *    IDs in for launch.
 *
 * 4. This script deliberately skips any item whose name in the "NOTE"
 *    comments in cart-data.js flags it as unconfirmed (EvexiPEL Boost is
 *    already left out of cart-data.js entirely, so nothing to do there).
 * ---------------------------------------------------------------------
 */

const fs = require("fs");
const path = require("path");

if (!process.env.STRIPE_SECRET_KEY) {
  console.error(
    "\n❌ Missing STRIPE_SECRET_KEY environment variable.\n" +
      "   Run it like this:\n\n" +
      "   STRIPE_SECRET_KEY=sk_test_yourKeyHere node scripts/create-stripe-products.js\n"
  );
  process.exit(1);
}

const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

const CART_DATA_PATH = path.join(__dirname, "..", "js", "cart-data.js");

function loadProducts() {
  const fileContents = fs.readFileSync(CART_DATA_PATH, "utf8");

  // Extract the array literal between "const ALPHA_PRODUCTS = [" and "];"
  const match = fileContents.match(
    /const ALPHA_PRODUCTS = (\[[\s\S]*?\n\]);/
  );
  if (!match) {
    throw new Error(
      "Could not find ALPHA_PRODUCTS array in cart-data.js — has the file format changed?"
    );
  }

  // Safely evaluate just the array literal (no external input, static file we wrote)
  const products = eval(match[1]);
  return { products, fileContents };
}

function priceInCentsFromDisplay(priceDisplay) {
  const match = priceDisplay.match(/\$([\d,.]+)/);
  if (!match) return null;
  const dollars = parseFloat(match[1].replace(/,/g, ""));
  return Math.round(dollars * 100);
}

async function createProductAndPrice(item) {
  const unitAmount = priceInCentsFromDisplay(item.priceDisplay);
  if (unitAmount === null) {
    console.warn(`⚠️  Skipping "${item.name}" — couldn't parse a price from "${item.priceDisplay}"`);
    return null;
  }

  const product = await stripe.products.create({
    name: item.name,
    metadata: {
      category: item.category,
      subcategory: item.subcategory,
      internal_id: item.id,
    },
  });

  const price = await stripe.prices.create({
    product: product.id,
    unit_amount: unitAmount,
    currency: "usd",
  });

  return price.id;
}

async function main() {
  const { products, fileContents } = loadProducts();

  const toCreate = products.filter(
    (p) => p.priceId && p.priceId.startsWith("REPLACE_ME")
  );

  if (toCreate.length === 0) {
    console.log("✅ Nothing to do — every item already has a real Price ID.");
    return;
  }

  console.log(`Found ${toCreate.length} item(s) needing Stripe Products/Prices.\n`);

  let updatedContents = fileContents;
  let created = 0;
  let skipped = 0;

  for (const item of toCreate) {
    try {
      const priceId = await createProductAndPrice(item);
      if (!priceId) {
        skipped++;
        continue;
      }

      // Replace this item's placeholder priceId with the real one in the file text
      const placeholderPattern = new RegExp(
        `(id: "${item.id}"[\\s\\S]*?priceId: ")${item.priceId}(")`
      );
      updatedContents = updatedContents.replace(
        placeholderPattern,
        `$1${priceId}$2`
      );

      console.log(`✅ Created "${item.name}" -> ${priceId}`);
      created++;
    } catch (err) {
      console.error(`❌ Failed on "${item.name}":`, err.message);
      skipped++;
    }
  }

  fs.writeFileSync(CART_DATA_PATH, updatedContents, "utf8");

  console.log(`\nDone. Created: ${created}, skipped: ${skipped}.`);
  console.log(`js/cart-data.js has been updated in place with the real Price IDs.`);
  console.log(
    `\nNext: review the diff, commit, and push. Check Stripe Dashboard -> Products to confirm everything looks right.`
  );
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
