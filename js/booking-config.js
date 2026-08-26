/**
 * ALPHA AESTHETICS & HEALTH — BOOKING CONFIG
 *
 * Single source of truth for the appointment booker on booking.html.
 *
 * WHY VISIT TYPES INSTEAD OF 58 CALENDARS:
 * The clinic sells 58 bookable treatments, but they only need ~20 distinct
 * blocks of chair time. Cal.com gets ONE event type per visitType below —
 * about 20 of them, not 58 — and the specific treatment the patient picked
 * travels along as a booking field. Fewer calendars to keep in sync, and it
 * matches how the clinic actually works: the provider confirms the exact
 * product at the visit.
 *
 * DURATIONS ARE INDUSTRY REFERENCE VALUES, NOT THE CLINIC'S OWN NUMBERS.
 * Alpha Aesthetics had not measured these, so they were sourced from med spa
 * and manufacturer published times (see BOOKING-DURATIONS.md for the
 * citations behind each one). Four of them came from the clinic's own product
 * names, which already state the time, and those are marked `clinicStated`.
 *
 * Each duration is TOTAL CHAIR TIME, not just the procedure. That matters:
 * Virtue RF and PDO need 30–45 min of topical anesthetic before anything
 * starts, so booking only the procedure time would double-book the room.
 *
 * TO ADJUST: change `minutes` here, then change the matching Cal.com event
 * type's duration to the same number. They must agree or the calendar will
 * offer slots the clinic cannot staff.
 */

const ALPHA_BOOKING = {
  /**
   * Cal.com wiring. While `enabled` is false the booker falls back to the
   * existing request form, so the page keeps working exactly as before.
   *
   * TO TURN THE CALENDAR ON:
   * 1. Create a Cal.com team with Dr. Davis as the host.
   * 2. Create one event type per key in `visitTypes` below. The event slug
   *    must match the key, and its duration must match `minutes`.
   * 3. Set the team's availability to the `hours` block below.
   * 4. Put the team slug here and flip `enabled` to true.
   */
  calcom: {
    enabled: false,
    teamSlug: "", // e.g. "alpha-aesthetics" -> cal.com/team/alpha-aesthetics/<slug>
  },

  /**
   * Providers who take bookings. Dr. Davis performs the treatments, so she is
   * the only one on the booking calendar — Dr. Heisser still appears in the
   * "Our Providers" section of index.html, he just is not bookable here.
   *
   * Adding a second provider here brings the "with which provider?" step back
   * automatically. Restricting individual treatments to one provider is not
   * built — every provider in this list is offered for every treatment.
   */
  providers: [
    {
      id: "davis",
      name: "Dr. Laurie Davis, NP",
      role: "Nurse Practitioner · aesthetic & regenerative medicine",
      photo: "images/lauriedavis.jpg",
    },
  ],

  // Clinic hours. Saturday runs full hours per the owner; index.html's FAQ and
  // JSON-LD openingHours were updated to match.
  hours: {
    timeZone: "America/New_York",
    weekly: {
      monday: ["09:00", "17:00"],
      tuesday: ["09:00", "17:00"],
      wednesday: ["09:00", "17:00"],
      thursday: ["09:00", "17:00"],
      friday: ["09:00", "17:00"],
      saturday: ["09:00", "17:00"],
      sunday: null,
    },
  },

  // One Cal.com event type per entry. `slug` is the Cal.com event slug.
  visitTypes: {
    "initial-consultation":  { minutes: 45, label: "Initial consultation" },
    "neurotoxins":      { minutes: 30, label: "Botox / Dysport" },
    "dermal-fillers":          { minutes: 45, label: "Dermal fillers" },
    "pdo-single-area":          { minutes: 60, label: "PDO Smooth Lift — single area" },
    "pdo-thread-lift-full":      { minutes: 90, label: "Full PDO Thread Lift" },
    "virtue-rf-face":     { minutes: 90, label: "Virtue RF — face" },
    "virtue-rf-face-extended": { minutes: 120, label: "Virtue RF — extended face" },
    "virtue-rf-small-area":   { minutes: 75, label: "Virtue RF — small area" },
    "virtue-rf-medium-area":   { minutes: 105, label: "Virtue RF — medium area" },
    "virtue-rf-large-area":   { minutes: 120, label: "Virtue RF — large area" },
    "physiq":            { minutes: 30, label: "PHYSIQ — single session" },
    "vi-peel":           { minutes: 30, label: "VI Peel" },
    "vi-peel-body-large":    { minutes: 45, label: "VI Peel Body — large area" },
    "facial-30":         { minutes: 30, label: "Facial — 30 min" },
    "facial-45":         { minutes: 45, label: "Facial — 45 min" },
    "facial-60":         { minutes: 60, label: "Facial — 60 min" },
    "red-light":         { minutes: 20, label: "Red Light Therapy" },
    "iv-therapy":        { minutes: 60, label: "IV therapy" },
    "labs":              { minutes: 15, label: "Lab draw" },
    "pellets":           { minutes: 30, label: "Pellet insertion" },
    "injection":         { minutes: 15, label: "Injection" },
    "weight-loss-followup":  { minutes: 20, label: "Weight loss follow-up" },
    "education-session":         { minutes: 60, label: "Education session" },
  },

  /**
   * Every bookable treatment, mapped to the visit type that reserves the
   * right amount of chair time. `id` matches js/cart-data.js so the booker and
   * the cart never drift apart.
   *
   * `note` shows on the confirmation step when the patient needs to know
   * something before arriving.
   * `packageOf` means the price covers N sessions; the patient books them one
   * at a time, so only one session's time is reserved here.
   * `addOn` items are never booked alone — they attach to another visit.
   */
  treatments: [
    // ---------------- INJECTABLES ----------------
    { id: "dysport-unit", visit: "neurotoxins" },
    { id: "botox-unit", visit: "neurotoxins" },

    { id: "restylane-lyft", visit: "dermal-fillers" },
    { id: "restylane-defyne", visit: "dermal-fillers" },
    { id: "restylane-refine", visit: "dermal-fillers" },
    { id: "restylane-contour", visit: "dermal-fillers" },
    { id: "restylane-l", visit: "dermal-fillers" },

    { id: "pdo-full", visit: "pdo-thread-lift-full", note: "Includes time for topical numbing." },
    { id: "pdo-nasolabial", visit: "pdo-single-area", note: "Includes time for topical numbing." },
    { id: "pdo-marionette", visit: "pdo-single-area", note: "Includes time for topical numbing." },
    { id: "pdo-eye-trough", visit: "pdo-single-area", note: "Includes time for topical numbing." },
    { id: "pdo-lips", visit: "pdo-single-area", note: "Includes time for topical numbing." },

    // ---------------- BODY CONTOURING ----------------
    { id: "physiq-single", visit: "physiq" },
    { id: "physiq-5session", visit: "physiq", packageOf: 5 },

    { id: "virtue-face", visit: "virtue-rf-face", note: "Includes 45 min of topical numbing before treatment." },
    { id: "virtue-face-neck", visit: "virtue-rf-face-extended", note: "Includes 45 min of topical numbing before treatment." },
    { id: "virtue-face-neck-chest", visit: "virtue-rf-face-extended", note: "Includes 45 min of topical numbing before treatment." },

    { id: "virtue-submental", visit: "virtue-rf-small-area", note: "Includes time for topical numbing." },
    { id: "virtue-scars", visit: "virtue-rf-small-area", note: "Includes time for topical numbing." },
    { id: "virtue-arms", visit: "virtue-rf-medium-area", note: "Includes time for topical numbing." },
    { id: "virtue-stretch-marks", visit: "virtue-rf-medium-area", note: "Includes time for topical numbing." },
    { id: "virtue-abdomen", visit: "virtue-rf-large-area", note: "Includes time for topical numbing." },
    { id: "virtue-thighs", visit: "virtue-rf-large-area", note: "Includes time for topical numbing." },
    { id: "virtue-buttox", visit: "virtue-rf-large-area", note: "Includes time for topical numbing." },

    // ---------------- SKIN TREATMENTS ----------------
    { id: "vi-peel", visit: "vi-peel", note: "You leave with the peel on and rinse it off 4 hours later." },
    { id: "vi-peel-advanced", visit: "vi-peel", note: "You leave with the peel on and rinse it off 4 hours later." },
    { id: "vi-peel-precision-plus", visit: "vi-peel", note: "You leave with the peel on and rinse it off 4 hours later." },
    { id: "vi-peel-purify", visit: "vi-peel", note: "You leave with the peel on and rinse it off 4 hours later." },
    { id: "vi-peel-purify-precision", visit: "vi-peel", note: "You leave with the peel on and rinse it off 4 hours later." },
    { id: "vi-peel-body-small", visit: "vi-peel", note: "You leave with the peel on and rinse it off 4 hours later." },
    { id: "vi-peel-body-large", visit: "vi-peel-body-large", note: "You leave with the peel on and rinse it off 4 hours later." },

    // Durations stated by the clinic in the product names themselves.
    { id: "facial-teen", visit: "facial-30", clinicStated: true },
    { id: "facial-signature", visit: "facial-45", clinicStated: true },
    { id: "facial-sports", visit: "facial-60", clinicStated: true },

    { id: "rlt-single", visit: "red-light", clinicStated: true },
    { id: "rlt-5pack", visit: "red-light", clinicStated: true, packageOf: 5 },
    { id: "rlt-10pack", visit: "red-light", clinicStated: true, packageOf: 10 },

    // ---------------- HORMONE & WELLNESS ----------------
    { id: "evexipel-consult", visit: "initial-consultation" },
    { id: "evexipel-labs-male", visit: "labs", note: "Fasting may be required — the clinic will confirm." },
    { id: "evexipel-labs-female", visit: "labs", note: "Fasting may be required — the clinic will confirm." },
    { id: "evexipel-post-labs-male", visit: "labs" },
    { id: "evexipel-post-labs-female", visit: "labs" },
    { id: "evexipel-male-procedure", visit: "pellets" },
    { id: "evexipel-female-procedure", visit: "pellets" },
    { id: "evexipel-followup-t-injection", visit: "injection" },
    { id: "evexipel-t-cypionate", visit: "injection" },
    { id: "sermorelin-injection", visit: "injection" },

    { id: "iv-executive", visit: "iv-therapy" },
    { id: "iv-natural-defense", visit: "iv-therapy" },
    { id: "iv-glutathione-addon", visit: "iv-therapy", addOn: true },
    { id: "iv-amino-addon", visit: "iv-therapy", addOn: true },

    // ---------------- MEDICAL WEIGHT LOSS ----------------
    { id: "wl-initial-consult", visit: "initial-consultation" },
    { id: "wl-semaglutide-visit", visit: "weight-loss-followup" },
    { id: "wl-tirzepatide-low", visit: "weight-loss-followup" },
    { id: "wl-tirzepatide-mid", visit: "weight-loss-followup" },
    { id: "wl-tirzepatide-high", visit: "weight-loss-followup" },

    // ---------------- CONSULTATIONS ----------------
    { id: "muse-consult", visit: "initial-consultation" },
    { id: "peptide-education-session", visit: "education-session" },
  ],
};

// Make available globally (plain script include, no bundler). A top-level
// `const` is not a window property, so this assignment is required.
if (typeof window !== "undefined") window.ALPHA_BOOKING = ALPHA_BOOKING;
if (typeof module !== "undefined") module.exports = { ALPHA_BOOKING };
