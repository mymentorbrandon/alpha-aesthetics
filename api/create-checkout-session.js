/**
 * VERCEL FUNCTION: /api/create-checkout-session
 *
 * Thin adapter over the existing Netlify handler so the Stripe logic
 * (price-ID validation, session creation) lives in exactly one place.
 * Same env var as Netlify: STRIPE_SECRET_KEY (+ optional SITE_URL).
 */

const { handler } = require("../netlify/functions/create-checkout-session");

module.exports = async (req, res) => {
  const result = await handler({
    httpMethod: req.method,
    body: typeof req.body === "string" ? req.body : JSON.stringify(req.body ?? null),
    headers: req.headers,
  });
  res.setHeader("content-type", "application/json");
  res.status(result.statusCode).send(result.body);
};
