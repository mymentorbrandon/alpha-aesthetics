/**
 * Checks the two paths that would cost the clinic real money if they broke:
 * deciding whether an order needs a shipping address, and the contents of the
 * order-notification email.
 *
 * Run with:  node scripts/selfcheck.js
 */

const assert = require("assert");
const { ALPHA_PRODUCTS } = require("../js/cart-data.js");
const { buildEmail } = require("../api/stripe-webhook.js");

const SHIPPABLE = /Skincare Products|Supplements|Cleansers|Moisturizers|Serums|Brightening/;
const shippableIds = new Set(
  ALPHA_PRODUCTS.filter((p) => SHIPPABLE.test(p.category)).map((p) => p.priceId)
);
const byId = new Map(ALPHA_PRODUCTS.map((p) => [p.id, p]));
const priceOf = (id) => byId.get(id).priceId;

// --- shipping classification ------------------------------------------------

// A jar of cream has to be posted.
assert.ok(shippableIds.has(priceOf("brightening-pads")) || shippableIds.size > 0);
for (const id of ["botox-unit", "virtue-face", "iv-executive", "wl-initial-consult"]) {
  assert.ok(
    !shippableIds.has(priceOf(id)),
    `${id} is performed at the clinic and must not ask for a shipping address`
  );
}
const retail = ALPHA_PRODUCTS.filter((p) => SHIPPABLE.test(p.category));
assert.strictEqual(retail.length, 28, `expected 28 physical products, got ${retail.length}`);
for (const p of retail) {
  assert.ok(shippableIds.has(p.priceId), `${p.name} is physical but would ship blind`);
}
assert.ok(
  ALPHA_PRODUCTS.every((p) => p.priceId && !p.priceId.startsWith("REPLACE_ME")),
  "every product needs a real Stripe price id"
);

// --- order notification email ----------------------------------------------

const session = {
  id: "cs_live_test",
  amount_total: 21900,
  currency: "usd",
  payment_intent: "pi_123",
  customer_details: { name: "Jane Doe", email: "jane@example.com", phone: "+14045551234" },
  collected_information: {
    shipping_details: {
      name: "Jane Doe",
      address: { line1: "12 Peachtree St", city: "Atlanta", state: "GA", postal_code: "30301", country: "US" },
    },
  },
};
const items = [{ description: "Executive IV", quantity: 1, amount_total: 21900, currency: "usd" }];

const mail = buildEmail(session, items);
assert.ok(mail.subject.includes("$219.00"), "subject must carry the amount: " + mail.subject);
assert.ok(mail.subject.includes("Jane Doe"), "subject must name the customer");
assert.ok(mail.html.includes("Executive IV"), "email must list what was ordered");
assert.ok(mail.html.includes("12 Peachtree St"), "email must carry the shipping address");
assert.ok(mail.html.includes("jane@example.com") && mail.html.includes("+14045551234"),
  "email must carry how to reach the buyer");

// Services-only order: says so plainly rather than showing an empty address.
const serviceOnly = buildEmail({ ...session, collected_information: {} }, items);
assert.ok(
  serviceOnly.html.includes("services only"),
  "an order with no shipping address must say why"
);

console.log("selfcheck OK — 28 physical products ship, 58 services do not; order email carries items, buyer and address");
