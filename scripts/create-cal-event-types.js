/**
 * CREATE THE CAL.COM EVENT TYPES FOR THE BOOKER
 *
 * Reads js/booking-config.js and creates one Cal.com event type per entry in
 * `visitTypes`, using its key as the slug and its `minutes` as the duration.
 * That is exactly what js/booking-ui.js expects, so the calendar lines up with
 * the booker without anyone copying 23 numbers by hand.
 *
 * SAFE TO RE-RUN: it checks which slugs already exist on the public profile and
 * skips them, so running it twice will not create duplicates.
 *
 * --sync repairs event types that already exist, bringing their duration and
 * location back in line with booking-config.js. Run it after changing any
 * `minutes` value — if Cal.com and the config disagree, the site advertises one
 * length and the calendar books another.
 *
 * ---------------------------------------------------------------------
 * HOW TO RUN
 * ---------------------------------------------------------------------
 * 1. Get an API key: Cal.com -> Settings -> Developer -> API keys -> Add.
 *    It starts with "cal_".
 *
 * 2. From the repo root:
 *
 *      CAL_API_KEY=cal_xxx node scripts/create-cal-event-types.js
 *
 *    (PowerShell:  $env:CAL_API_KEY="cal_xxx"
 *                  node scripts/create-cal-event-types.js )
 *
 * 3. Dry run first if you want to see what it would do without creating
 *    anything:
 *
 *      CAL_API_KEY=cal_xxx node scripts/create-cal-event-types.js --dry-run
 *
 * The key is read from the environment and never written to disk. Note that a
 * key pasted on the command line stays in your shell history — `history -d` it
 * afterwards, or export it in a subshell.
 *
 * AFTER RUNNING: set `calcom.enabled` to true in js/booking-config.js and the
 * booker swaps the request form for the live calendar.
 * ---------------------------------------------------------------------
 */

const { ALPHA_BOOKING } = require("../js/booking-config.js");

const API = "https://api.cal.com/v2/event-types";
const API_VERSION = "2024-06-14";
const PROFILE = ALPHA_BOOKING.calcom.base;
const DRY_RUN = process.argv.includes("--dry-run");
const SYNC = process.argv.includes("--sync") || process.argv.includes("--set-location");

// Every visit is in person at the clinic.
const LOCATIONS = [
  { type: "address", address: ALPHA_BOOKING.location.address, public: true },
];

/**
 * Show every visitor the clinic's own timezone instead of their device's.
 * Without this, someone booking from another timezone sees the slot converted
 * to theirs and gets a confirmation in that timezone — for an appointment they
 * have to physically attend in Alpharetta. They would arrive hours off.
 */
const LOCK_TIMEZONE = true;

const key = process.env.CAL_API_KEY;
if (!key) {
  console.error(
    "\n❌ Missing CAL_API_KEY environment variable.\n" +
      "   Run it like this:\n\n" +
      "   CAL_API_KEY=cal_xxx node scripts/create-cal-event-types.js\n"
  );
  process.exit(1);
}

if (!PROFILE || PROFILE.startsWith("team/")) {
  console.error(
    "\n❌ calcom.base in js/booking-config.js must be a personal username for\n" +
      "   this script (team event types are created differently). Got: " +
      JSON.stringify(PROFILE) +
      "\n"
  );
  process.exit(1);
}

/**
 * A slug is "already there" if its public booking page resolves. That is a
 * plain GET with no auth, which keeps this check independent of whatever the
 * API key can see.
 */
async function alreadyExists(slug) {
  const res = await fetch(`https://cal.com/${PROFILE}/${slug}`, {
    method: "HEAD",
    redirect: "manual",
  });
  return res.status === 200;
}

async function createEventType(slug, visit) {
  const body = {
    lengthInMinutes: visit.minutes,
    title: visit.label,
    slug,
    locations: LOCATIONS,
    lockTimeZoneToggleOnBookingPage: LOCK_TIMEZONE,
  };

  if (DRY_RUN) return { dryRun: true, body };

  const res = await fetch(API, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "cal-api-version": API_VERSION,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const text = await res.text();
  if (!res.ok) throw new Error(`HTTP ${res.status} — ${text.slice(0, 300)}`);
  return JSON.parse(text);
}

/** The public listing carries the id, so no auth is needed just to find it. */
async function findEventType(slug) {
  const res = await fetch(
    `https://api.cal.com/v2/event-types?username=${PROFILE}&eventSlug=${slug}`,
    { headers: { "cal-api-version": API_VERSION } }
  );
  if (!res.ok) throw new Error(`lookup HTTP ${res.status}`);
  const json = await res.json();
  const data = Array.isArray(json.data) ? json.data[0] : json.data;
  if (!data || !data.id) throw new Error("not found");
  return data;
}

async function syncEventType(slug, visit) {
  const et = await findEventType(slug);
  const body = {};
  const changes = [];

  if (!JSON.stringify(et.locations || []).includes('"address"')) {
    body.locations = LOCATIONS;
    changes.push("location");
  }
  if (et.lengthInMinutes !== visit.minutes) {
    body.lengthInMinutes = visit.minutes;
    changes.push(`${et.lengthInMinutes}→${visit.minutes} min`);
  }
  if (et.lockTimeZoneToggleOnBookingPage !== LOCK_TIMEZONE) {
    body.lockTimeZoneToggleOnBookingPage = LOCK_TIMEZONE;
    changes.push("lock timezone");
  }

  if (!changes.length) return { skipped: true };
  if (DRY_RUN) return { changes };

  const res = await fetch(`${API}/${et.id}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${key}`,
      "cal-api-version": API_VERSION,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`HTTP ${res.status} — ${text.slice(0, 300)}`);
  return { changes };
}

async function runSync() {
  const entries = Object.entries(ALPHA_BOOKING.visitTypes);
  console.log(
    `\nSyncing ${entries.length} event types with booking-config.js` +
      (DRY_RUN ? "  (DRY RUN)\n" : "\n")
  );
  let done = 0, skipped = 0;
  const failed = [];
  for (const [slug, visit] of entries) {
    try {
      const r = await syncEventType(slug, visit);
      if (r.skipped) { console.log(`  ⊙ skip    ${slug} — already matches`); skipped++; }
      else { console.log(`  ${DRY_RUN ? "· would fix" : "✓ synced  "} ${slug} — ${r.changes.join(", ")}`); done++; }
    } catch (err) {
      console.log(`  ✗ FAILED  ${slug} — ${err.message}`);
      failed.push(slug);
    }
  }
  console.log(`\n${done} ${DRY_RUN ? "would be updated" : "updated"}, ${skipped} skipped, ${failed.length} failed.`);
  if (failed.length) { console.log(`Failed: ${failed.join(", ")}`); process.exit(1); }
}

async function main() {
  if (SYNC) return runSync();
  const entries = Object.entries(ALPHA_BOOKING.visitTypes);
  console.log(
    `\n${entries.length} visit types in booking-config.js → cal.com/${PROFILE}/<slug>` +
      (DRY_RUN ? "  (DRY RUN — nothing will be created)\n" : "\n")
  );

  let created = 0;
  let skipped = 0;
  const failed = [];

  for (const [slug, visit] of entries) {
    const label = `${slug} (${visit.minutes} min)`;
    try {
      if (await alreadyExists(slug)) {
        console.log(`  ⊙ skip    ${label} — already exists`);
        skipped++;
        continue;
      }
      await createEventType(slug, visit);
      console.log(`  ${DRY_RUN ? "· would create" : "✓ created     "} ${label}`);
      created++;
    } catch (err) {
      console.log(`  ✗ FAILED  ${label} — ${err.message}`);
      failed.push(slug);
    }
  }

  console.log(
    `\n${created} ${DRY_RUN ? "would be created" : "created"}, ` +
      `${skipped} skipped, ${failed.length} failed.`
  );

  if (failed.length) {
    console.log(`Failed slugs: ${failed.join(", ")}`);
    console.log("Re-run the script — the ones that worked will be skipped.\n");
    process.exit(1);
  }

  if (!DRY_RUN) {
    console.log(
      "\nNext:\n" +
        "  1. In Cal.com, set availability to Mon–Sat 09:00–17:00, America/New_York.\n" +
        "  2. Set calcom.enabled = true in js/booking-config.js.\n" +
        "  3. Commit and push — the booker swaps the form for the live calendar.\n"
    );
  }
}

main().catch((err) => {
  console.error("\n❌ " + err.message + "\n");
  process.exit(1);
});
