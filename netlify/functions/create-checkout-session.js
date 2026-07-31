/**
 * NETLIFY FUNCTION: create-checkout-session
 *
 * Endpoint: /.netlify/functions/create-checkout-session
 *
 * Receives: { lineItems: [{ priceId: "price_...", quantity: 2 }, ...] }
 * Returns:  { url: "https://checkout.stripe.com/..." }
 *
 * SETUP REQUIRED:
 * 1. In the repo root, run: npm install stripe
 * 2. In Netlify Dashboard -> Site settings -> Environment variables, add:
 *      STRIPE_SECRET_KEY = sk_test_...   (use the TEST key first, switch to
 *                                          live key only when ready to go live)
 * 3. Optionally set SITE_URL (e.g. https://alphaaesthetichealth.com) so
 *    success/cancel redirects point to the real domain. Falls back to the
 *    request's own origin if not set.
 *
 * SECURITY NOTE:
 * We only ever send Stripe Price IDs (created in the Stripe Dashboard) —
 * never raw dollar amounts from the browser. This means a patient cannot
 * tamper with the price by editing browser code; Stripe always charges
 * whatever amount is actually configured on that Price ID.
 */

const Stripe = require("stripe");

exports.handler = async function (event) {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  if (!process.env.STRIPE_SECRET_KEY) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Stripe secret key not configured" }),
    };
  }

  const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

  let payload;
  try {
    payload = JSON.parse(event.body);
  } catch (e) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Invalid JSON body" }),
    };
  }

  const lineItems = payload.lineItems;
  if (!Array.isArray(lineItems) || lineItems.length === 0) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "lineItems must be a non-empty array" }),
    };
  }

  // Validate + normalize each line item
  const stripeLineItems = [];
  for (const item of lineItems) {
    if (!item.priceId || typeof item.priceId !== "string") {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Each line item needs a valid priceId" }),
      };
    }
    const quantity = Math.max(1, parseInt(item.quantity, 10) || 1);
    stripeLineItems.push({ price: item.priceId, quantity });
  }

  const origin =
    process.env.SITE_URL ||
    event.headers.origin ||
    `https://${event.headers.host}`;

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: stripeLineItems,
      success_url: `${origin}/checkout-success.html?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout-cancelled.html`,
      // Collects billing address; useful for receipts/records.
      billing_address_collection: "auto",
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ url: session.url }),
    };
  } catch (err) {
    console.error("Stripe session creation failed:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Could not create checkout session" }),
    };
  }
};
