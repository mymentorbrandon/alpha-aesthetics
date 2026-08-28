/**
 * VERCEL FUNCTION: /api/checkout-session?session_id=cs_...
 *
 * Feeds checkout-success.html so it can show what was actually bought instead
 * of a generic thank-you that appears for anyone who opens the URL.
 *
 * Returns only what the buyer already knows — their own items, total and
 * payment status. No customer records, no other sessions: the session id acts
 * as the bearer token, which is how Stripe's own success-page flow works.
 */

const Stripe = require("stripe");

module.exports = async (req, res) => {
  res.setHeader("content-type", "application/json");

  if (req.method !== "GET") {
    return res.status(405).send(JSON.stringify({ error: "Method not allowed" }));
  }
  if (!process.env.STRIPE_SECRET_KEY) {
    return res.status(500).send(JSON.stringify({ error: "Stripe secret key not configured" }));
  }

  const sessionId = req.query?.session_id;
  // Stripe session ids look like cs_live_… / cs_test_…; reject anything else
  // rather than forwarding arbitrary strings to the API.
  if (!sessionId || !/^cs_[A-Za-z0-9_]+$/.test(sessionId)) {
    return res.status(400).send(JSON.stringify({ error: "Missing or malformed session_id" }));
  }

  const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const items = await stripe.checkout.sessions.listLineItems(sessionId, { limit: 100 });

    return res.status(200).send(
      JSON.stringify({
        paid: session.payment_status === "paid",
        amountTotal: session.amount_total,
        currency: session.currency,
        email: session.customer_details?.email || null,
        items: items.data.map((li) => ({
          name: li.description,
          quantity: li.quantity,
          amountTotal: li.amount_total,
        })),
      })
    );
  } catch (err) {
    console.error("checkout-session lookup failed:", err.message);
    return res.status(404).send(JSON.stringify({ error: "Session not found" }));
  }
};
