/**
 * ALPHA AESTHETICS & HEALTH — APPOINTMENT BOOKER
 *
 * Load AFTER cart-data.js and booking-config.js:
 *   <script src="/js/cart-data.js"></script>
 *   <script src="/js/booking-config.js"></script>
 *   <script src="/js/booking-ui.js"></script>
 *
 * Pick a treatment, then pick a time. A "with which provider?" step appears
 * between them only when ALPHA_BOOKING.providers holds more than one — today it
 * holds only Dr. Davis, so the booker renders two steps.
 *
 * The final step has two modes. When ALPHA_BOOKING.calcom.enabled is true it
 * mounts the Cal.com calendar for the treatment's visit type, so the patient
 * sees real open slots and books them. Until then it falls back to the request
 * form that was already on this page, pre-filled with the treatment and
 * provider — so the page never regresses while the Cal.com team is being set up.
 *
 * The treatment <select> deliberately carries id="service", because the existing
 * form submit handler reads that element. Keeping the id means the booker can be
 * added without rewriting the submit path.
 */

(function () {
  const B = window.ALPHA_BOOKING;
  const PRODUCTS = window.ALPHA_PRODUCTS || [];
  const mount = document.getElementById("booker");
  if (!B || !mount) return;

  const byId = new Map(PRODUCTS.map((p) => [p.id, p]));

  // Treatments the catalog actually knows about, in catalog order so the groups
  // read the same way they do on the service pages.
  const treatments = B.treatments
    .map((t) => ({ ...t, product: byId.get(t.id), type: B.visitTypes[t.visit] }))
    .filter((t) => t.product && t.type);

  // With a single bookable provider there is nothing to choose, so the picker
  // is skipped and that provider is the answer. It comes back automatically if
  // a second one is added to the config.
  const multiProvider = B.providers.length > 1;
  const state = {
    treatment: null,
    provider: multiProvider ? "any" : B.providers[0]?.id || "",
  };

  function minutesLabel(min) {
    if (min < 60) return `${min} min`;
    const h = Math.floor(min / 60);
    const m = min % 60;
    return m ? `${h} h ${m} min` : `${h} h`;
  }

  /* ── STEP 1: treatment ───────────────────────────────────────────────── */

  function treatmentOptions() {
    const groups = new Map();
    for (const t of treatments) {
      const label = t.product.subcategory
        ? `${t.product.category} — ${t.product.subcategory}`
        : t.product.category;
      if (!groups.has(label)) groups.set(label, []);
      groups.get(label).push(t);
    }
    let html = '<option value="">Select a treatment…</option>';
    for (const [label, items] of groups) {
      html += `<optgroup label="${label}">`;
      for (const t of items) {
        html += `<option value="${t.id}">${t.product.name} · ${minutesLabel(t.type.minutes)}</option>`;
      }
      html += "</optgroup>";
    }
    return html;
  }

  /* ── OPTIONAL STEP: provider ────────────────────────────────────────────────── */

  function providerCards() {
    if (!multiProvider) return "";
    const any = `
      <label class="prov-card">
        <input type="radio" name="provider" value="any" checked />
        <span class="prov-body">
          <span class="prov-name">First available</span>
          <span class="prov-role">We&rsquo;ll match you with whoever opens up first</span>
        </span>
      </label>`;
    const each = B.providers
      .map(
        (p) => `
      <label class="prov-card">
        <input type="radio" name="provider" value="${p.id}" />
        <img src="${p.photo}" alt="${p.name}" onerror="this.style.display='none'" />
        <span class="prov-body">
          <span class="prov-name">${p.name}</span>
          <span class="prov-role">${p.role}</span>
        </span>
      </label>`
      )
      .join("");
    return any + each;
  }

  /* ── FINAL STEP: the time slot ───────────────────────────────────────────── */

  function calLink(t) {
    const { teamSlug } = B.calcom;
    return `${teamSlug}/${t.visit}`;
  }

  let calLoaded = false;
  function loadCal() {
    if (calLoaded) return;
    calLoaded = true;
    const s = document.createElement("script");
    s.src = "https://app.cal.com/embed/embed.js";
    document.head.appendChild(s);
  }

  function mountCalendar(t) {
    const host = document.getElementById("cal-embed");
    host.innerHTML = "";
    loadCal();
    // Cal's loader queues calls made before the script finishes, but only once
    // window.Cal exists, so poll briefly rather than assuming it is ready.
    const tryMount = () => {
      if (!window.Cal) return setTimeout(tryMount, 100);
      window.Cal("inline", {
        elementOrSelector: "#cal-embed",
        calLink: calLink(t),
        config: {
          // Travels to the clinic on the booking so the provider knows exactly
          // which of the 58 treatments the patient chose.
          "metadata[treatment]": t.product.name,
          "metadata[provider]": state.provider,
        },
      });
    };
    tryMount();
  }

  /* ── render ──────────────────────────────────────────────────────────── */

  // Steps are numbered from the ones actually rendered, so dropping the provider
  // picker leaves "1, 2" rather than "1, 3".
  const steps = [
    `<label class="bk-label" for="service"><span class="bk-num">%N%</span> What treatment are you booking?</label>
     <div class="select-wrap">
       <select id="service" name="service" required>${treatmentOptions()}</select>
     </div>
     <div class="bk-detail" id="bkDetail" hidden></div>`,
    multiProvider
      ? `<span class="bk-label"><span class="bk-num">%N%</span> With which provider?</span>
         <div class="prov-grid">${providerCards()}</div>`
      : null,
    `<span class="bk-label"><span class="bk-num">%N%</span> Pick your time</span>
     <div id="cal-embed"></div>
     <p class="bk-hint" id="bkHint">Select a treatment to see available times.</p>`,
  ].filter(Boolean);

  mount.innerHTML = steps
    .map((html, i) => `<div class="bk-step">${html.replace("%N%", i + 1)}</div>`)
    .join("");

  const select = document.getElementById("service");
  const detail = document.getElementById("bkDetail");
  const hint = document.getElementById("bkHint");
  const form = document.getElementById("bookingForm");

  function renderDetail() {
    const t = state.treatment;
    if (!t) {
      detail.hidden = true;
      return;
    }
    const bits = [
      `<strong>${minutesLabel(t.type.minutes)}</strong> in clinic`,
      t.product.priceDisplay,
    ];
    let extra = "";
    if (t.packageOf) {
      extra += `<span class="bk-flag">Price covers ${t.packageOf} sessions &mdash; you book them one at a time.</span>`;
    }
    if (t.addOn) {
      extra += `<span class="bk-flag">Add-on &mdash; attaches to an IV therapy visit rather than booked on its own.</span>`;
    }
    if (!multiProvider && B.providers[0]) {
      extra += `<span class="bk-flag">Performed by ${B.providers[0].name}</span>`;
    }
    if (t.note) extra += `<span class="bk-flag">${t.note}</span>`;
    detail.innerHTML = bits.join(" · ") + extra;
    detail.hidden = false;
  }

  function renderStep3() {
    const t = state.treatment;
    const calOn = B.calcom.enabled && B.calcom.teamSlug;

    if (!t) {
      hint.hidden = false;
      hint.textContent = "Select a treatment to see available times.";
      if (form) form.hidden = true;
      document.getElementById("cal-embed").innerHTML = "";
      return;
    }

    if (calOn) {
      hint.hidden = true;
      if (form) form.hidden = true;
      mountCalendar(t);
    } else {
      // Calendar not set up yet — keep the request form working.
      hint.hidden = false;
      hint.textContent =
        "Send your request and we'll confirm your time within 24 hours.";
      if (form) form.hidden = false;
    }
  }

  select.addEventListener("change", () => {
    state.treatment = treatments.find((t) => t.id === select.value) || null;
    renderDetail();
    renderStep3();
  });

  mount.addEventListener("change", (e) => {
    if (e.target.name !== "provider") return;
    state.provider = e.target.value;
    if (state.treatment && B.calcom.enabled) renderStep3();
  });

  renderStep3();

  // Let the existing form submit handler read what was picked here.
  window.ALPHA_BOOKING_STATE = state;
})();
