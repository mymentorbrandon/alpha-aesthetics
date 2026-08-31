/**
 * VERCEL FUNCTION: /api/stripe-webhook
 *
 * Stripe calls this when a checkout completes and it sends two emails: one to
 * the clinic with everything needed to fulfil the order, and one to the patient
 * confirming what they bought and what happens next. They go out independently,
 * so a bounce on one address does not cost the other.
 *
 * SETUP REQUIRED (Vercel -> Settings -> Environment Variables, Production):
 *   STRIPE_SECRET_KEY      already set
 *   STRIPE_WEBHOOK_SECRET  from Stripe -> Developers -> Webhooks -> add endpoint
 *                          https://www.alphaaesthetichealth.com/api/stripe-webhook
 *                          event: checkout.session.completed
 *   RESEND_API_KEY         from resend.com -> API Keys
 *   ORDER_EMAIL_TO         defaults to the address below
 *   ORDER_EMAIL_FROM       defaults to Resend's shared sender, which can only
 *                          deliver to the Resend account owner. To send to any
 *                          address, verify alphaaesthetichealth.com in Resend
 *                          and set this to orders@alphaaesthetichealth.com.
 *
 * The signature check is why this reads the raw body: Stripe signs the exact
 * bytes it sent, so Vercel's JSON parsing is disabled below. Without the check,
 * anyone who found this URL could post fake orders to the clinic.
 */

const Stripe = require("stripe");

const TO = process.env.ORDER_EMAIL_TO || "mhouse3@comcast.net";
const FROM = process.env.ORDER_EMAIL_FROM || "onboarding@resend.dev";

function money(cents, currency) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: (currency || "usd").toUpperCase(),
  }).format((cents || 0) / 100);
}

function formatAddress(a) {
  if (!a) return null;
  return [
    a.line1,
    a.line2,
    [a.city, a.state, a.postal_code].filter(Boolean).join(", "),
    a.country,
  ]
    .filter(Boolean)
    .join("<br/>");
}

/**
 * Stripe moved shipping details under collected_information in newer API
 * versions and kept the old top-level field on older ones, so check both
 * rather than depending on whichever version this account is pinned to.
 */
function getShipping(session) {
  return session.collected_information?.shipping_details || session.shipping_details || null;
}

function itemRows(lineItems) {
  return lineItems
    .map(
      (li) =>
        `<tr>
           <td style="padding:6px 12px 6px 0">${li.description || "—"}</td>
           <td style="padding:6px 12px;text-align:center">${li.quantity}</td>
           <td style="padding:6px 0;text-align:right">${money(li.amount_total, li.currency)}</td>
         </tr>`
    )
    .join("");
}

function itemTable(session, lineItems) {
  return `
    <table style="border-collapse:collapse;width:100%">
      <thead>
        <tr style="border-bottom:1px solid #e0dbd5">
          <th style="text-align:left;padding:0 12px 6px 0">Item</th>
          <th style="padding:0 12px 6px">Qty</th>
          <th style="text-align:right;padding:0 0 6px">Total</th>
        </tr>
      </thead>
      <tbody>${itemRows(lineItems)}</tbody>
      <tfoot>
        <tr style="border-top:1px solid #e0dbd5;font-weight:600">
          <td style="padding:8px 12px 0 0">Total</td>
          <td></td>
          <td style="text-align:right;padding:8px 0 0">${money(session.amount_total, session.currency)}</td>
        </tr>
      </tfoot>
    </table>`;
}

function buildAdminEmail(session, lineItems) {
  const shipping = getShipping(session);

  const shippingBlock = shipping
    ? `<h3 style="margin:24px 0 6px">Ship to</h3>
       <p style="margin:0;line-height:1.6">
         ${shipping.name || ""}<br/>${formatAddress(shipping.address) || ""}
       </p>`
    : `<p style="margin:24px 0 0;color:#666">
         No shipping address — this order is services only.
       </p>`;

  const customer = session.customer_details || {};

  return {
    subject: `New order — ${money(session.amount_total, session.currency)} — ${customer.name || customer.email || "website"}`,
    html: `
      <div style="font-family:system-ui,sans-serif;color:#2c2c2c;max-width:560px">
        <h2 style="margin:0 0 4px">New website order</h2>
        <p style="margin:0 0 20px;color:#666">Alpha Aesthetics &amp; Health</p>

        ${itemTable(session, lineItems)}

        <h3 style="margin:24px 0 6px">Customer</h3>
        <p style="margin:0;line-height:1.6">
          ${customer.name || "—"}<br/>
          ${customer.email || "—"}<br/>
          ${customer.phone || "—"}
        </p>

        ${shippingBlock}

        <p style="margin:28px 0 0;font-size:12px;color:#8a8a8a">
          Stripe payment ${session.payment_intent || session.id}
        </p>
      </div>`,
  };
}

/**
 * The patient's own copy. Deliberately not a receipt — Stripe already sends
 * that. This one tells them what happens next, which Stripe cannot know:
 * whether something is being posted to them or whether the clinic will call to
 * schedule.
 */
function buildCustomerEmail(session, lineItems) {
  const shipping = getShipping(session);
  const name = (session.customer_details?.name || "").split(" ")[0];

  const nextStep = shipping
    ? `<h3 style="margin:24px 0 6px">We're shipping to</h3>
       <p style="margin:0;line-height:1.6">
         ${shipping.name || ""}<br/>${formatAddress(shipping.address) || ""}
       </p>
       <p style="margin:16px 0 0">
         We'll get your order on its way and email you if anything comes up.
       </p>`
    : `<p style="margin:24px 0 0">
         Our team will contact you shortly to confirm your appointment details.
         If you already booked a time online, you'll have a separate calendar
         confirmation.
       </p>`;

  return {
    subject: `Your Alpha Aesthetics order — ${money(session.amount_total, session.currency)}`,
    html: `
      <div style="font-family:system-ui,sans-serif;color:#2c2c2c;max-width:560px">
        <h2 style="margin:0 0 4px">Thank you${name ? ", " + name : ""}!</h2>
        <p style="margin:0 0 20px;color:#666">
          We've received your payment. Here's what you ordered.
        </p>

        ${itemTable(session, lineItems)}

        ${nextStep}

        <div style="margin:28px 0 0;padding-top:16px;border-top:1px solid #e0dbd5;
                    font-size:13px;line-height:1.7;color:#555">
          <strong>Alpha Aesthetics &amp; Health</strong><br/>
          3450 Old Milton Parkway, Suite 100, Alpharetta, GA 30005<br/>
          (470) 610-4550
        </div>
      </div>`,
  };
}

async function sendEmail(to, { subject, html }) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from: FROM, to: [to], subject, html }),
  });
  if (!res.ok) {
    throw new Error(
      `Resend HTTP ${res.status} to ${to} — ${(await res.text()).slice(0, 200)}`
    );
  }
}

module.exports = async (req, res) => {
  if (req.method !== "POST") return res.status(405).send("Method not allowed");

  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!process.env.STRIPE_SECRET_KEY || !secret) {
    console.error("stripe-webhook: missing STRIPE_SECRET_KEY or STRIPE_WEBHOOK_SECRET");
    return res.status(500).send("Not configured");
  }

  const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const raw = Buffer.concat(chunks);

  // If the platform parsed the body first, the raw bytes are gone and the
  // signature can never match. Say so out loud — otherwise every order silently
  // fails verification and the clinic just stops getting emails.
  if (raw.length === 0 && req.body) {
    console.error(
      "stripe-webhook: body was parsed before this handler ran, so the raw bytes " +
        "needed for signature verification are lost. The bodyParser:false config " +
        "at the bottom of this file is not taking effect."
    );
    return res.status(500).send("Raw body unavailable");
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(raw, req.headers["stripe-signature"], secret);
  } catch (err) {
    console.error("stripe-webhook: bad signature —", err.message);
    return res.status(400).send("Invalid signature");
  }

  if (event.type !== "checkout.session.completed") {
    return res.status(200).send("Ignored");
  }

  /**
   * Stripe's newer event destinations can send a reduced payload that carries
   * only a reference instead of the full object. Everything below re-reads the
   * session from Stripe anyway, so all this needs is the id — take it from
   * whichever shape arrived rather than depending on that dashboard setting.
   */
  const sessionId = event.data?.object?.id || event.related_object?.id;
  if (!sessionId) {
    console.error(
      "stripe-webhook: event carried no checkout session id —",
      JSON.stringify(event).slice(0, 300)
    );
    return res.status(200).send("No session id");
  }

  // Acknowledge before emailing. Stripe retries on a non-2xx, and a Resend
  // outage should not make it redeliver an order the clinic already has.
  res.status(200).send("OK");

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const items = await stripe.checkout.sessions.listLineItems(session.id, { limit: 100 });
    const buyer = session.customer_details?.email;

    // Sent independently: the clinic must hear about the order even if the
    // patient's address bounces, and vice versa.
    const jobs = [
      { label: `clinic <${TO}>`, p: sendEmail(TO, buildAdminEmail(session, items.data)) },
    ];
    if (buyer) {
      jobs.push({
        label: `customer <${buyer}>`,
        p: sendEmail(buyer, buildCustomerEmail(session, items.data)),
      });
    } else {
      console.warn(`stripe-webhook: order ${session.id} had no buyer email`);
    }

    const results = await Promise.allSettled(jobs.map((j) => j.p));
    results.forEach((r, i) => {
      if (r.status === "fulfilled") {
        console.log(`stripe-webhook: order ${session.id} emailed to ${jobs[i].label}`);
      } else {
        console.error(
          `stripe-webhook: order ${session.id} FAILED to ${jobs[i].label} — ${r.reason.message}`
        );
      }
    });
  } catch (err) {
    // Logged rather than thrown: the payment already succeeded and is safe in
    // Stripe. Vercel's function logs are where to look if an email goes missing.
    console.error("stripe-webhook: could not email order —", err.message);
  }
};

// Stripe signs the exact bytes it sent, so the body must not be parsed first.
module.exports.config = { api: { bodyParser: false } };

// Exported for scripts/selfcheck.js — the email is the clinic's only notice
// that a sale happened, so its contents are worth pinning down.
module.exports.buildAdminEmail = buildAdminEmail;
module.exports.buildCustomerEmail = buildCustomerEmail;
