/**
 * ALPHA AESTHETICS & HEALTH — PRODUCT / PRICE DATA
 *
 * This is the single source of truth the cart reads from.
 *
 * HOW TO USE:
 * 1. Create each Product + Price in the Stripe Dashboard (or via API/script).
 * 2. Copy the real Price ID (looks like "price_1AbCdEfGhIjK...") from Stripe.
 * 3. Paste it into the matching `priceId` field below, replacing the
 *    "REPLACE_ME_..." placeholder.
 * 4. Until a placeholder is replaced, that item's "Add to Cart" button will
 *    show a friendly "coming soon" message instead of adding to cart —
 *    so nothing breaks if some items aren't set up in Stripe yet.
 *
 * unitBased: true  -> price is PER UNIT (e.g. Botox/Dysport). The quantity
 *            field on the page becomes "Units" instead of "Qty", and the
 *            Stripe Price should be created as the per-unit amount
 *            (Stripe multiplies unit_amount x quantity automatically).
 */

const ALPHA_PRODUCTS = [
  // ---------------- INJECTABLES: NEUROTOXINS ----------------
  { id: "dysport-unit", category: "Injectables", subcategory: "Neurotoxins", name: "Dysport (per unit)", priceDisplay: "$10/unit", priceId: "price_1Tz79gRsnDIQtm6chQG5IFln", unitBased: true },
  { id: "botox-unit", category: "Injectables", subcategory: "Neurotoxins", name: "Botox (per unit)", priceDisplay: "$11/unit", priceId: "price_1Tz79hRsnDIQtm6cDLb92uQU", unitBased: true },

  // ---------------- INJECTABLES: RESTYLANE FILLERS ----------------
  { id: "restylane-lyft", category: "Injectables", subcategory: "Restylane Fillers", name: "Restylane Lyft", priceDisplay: "$750", priceId: "price_1Tz79hRsnDIQtm6cBepM9Vat", unitBased: false },
  { id: "restylane-defyne", category: "Injectables", subcategory: "Restylane Fillers", name: "Restylane Defyne", priceDisplay: "$750", priceId: "price_1Tz79hRsnDIQtm6cr8aQa55Q", unitBased: false },
  { id: "restylane-refine", category: "Injectables", subcategory: "Restylane Fillers", name: "Restylane Refine", priceDisplay: "$600", priceId: "price_1Tz79iRsnDIQtm6clEKDNwpY", unitBased: false },
  { id: "restylane-contour", category: "Injectables", subcategory: "Restylane Fillers", name: "Restylane Contour", priceDisplay: "$750", priceId: "price_1Tz79iRsnDIQtm6cL9z17dni", unitBased: false },
  { id: "restylane-l", category: "Injectables", subcategory: "Restylane Fillers", name: "Restylane-L", priceDisplay: "$700", priceId: "price_1Tz79iRsnDIQtm6cCNbGfDmP", unitBased: false },

  // ---------------- INJECTABLES: PDO THREAD LIFT ----------------
  // NOTE: several of these show a discounted price on the site (e.g. "$725 / disc. $500").
  // Using the STANDARD price below by default — confirm with owner which price should
  // actually be charged before going live, then update priceDisplay + the Stripe Price.
  { id: "pdo-full", category: "Injectables", subcategory: "PDO Thread Lift", name: "Full PDO Thread Lift", priceDisplay: "$2,500 (ask about disc. $2,000)", priceId: "price_1Tz79jRsnDIQtm6cckyjtTS7", unitBased: false },
  { id: "pdo-nasolabial", category: "Injectables", subcategory: "PDO Thread Lift", name: "Smooth Lift – Nasolabial", priceDisplay: "$725 (ask about disc. $500)", priceId: "price_1Tz79jRsnDIQtm6cxzTnkUU8", unitBased: false },
  { id: "pdo-marionette", category: "Injectables", subcategory: "PDO Thread Lift", name: "Smooth Lift – Marionette", priceDisplay: "$500 (ask about disc. $375)", priceId: "price_1Tz79kRsnDIQtm6cmtYcgZwU", unitBased: false },
  { id: "pdo-eye-trough", category: "Injectables", subcategory: "PDO Thread Lift", name: "Smooth Lift – Eye Trough", priceDisplay: "$500 (ask about disc. $375)", priceId: "price_1Tz79kRsnDIQtm6cpTJlb2WB", unitBased: false },
  { id: "pdo-lips", category: "Injectables", subcategory: "PDO Thread Lift", name: "Smooth Lift – Lips", priceDisplay: "$375 (ask about disc. $250)", priceId: "price_1Tz79kRsnDIQtm6cwnODgS4X", unitBased: false },

  // ---------------- BODY CONTOURING: PHYSIQ ----------------
  { id: "physiq-5session", category: "Body Contouring", subcategory: "PHYSIQ", name: "PHYSIQ 5-Session Package", priceDisplay: "$3,000", priceId: "price_1Tz79lRsnDIQtm6cv65r2V8M", unitBased: false },
  { id: "physiq-single", category: "Body Contouring", subcategory: "PHYSIQ", name: "PHYSIQ Single Session", priceDisplay: "$600", priceId: "price_1Tz79lRsnDIQtm6cnFu3g9XZ", unitBased: false },

  // ---------------- BODY CONTOURING: VIRTUE RF FACE ----------------
  // Source: in-office price sheet (not currently listed on the website)
  { id: "virtue-face", category: "Body Contouring", subcategory: "Virtue RF Face", name: "Virtue RF – Face", priceDisplay: "$750", priceId: "price_1Tz79lRsnDIQtm6ccMIaB9kN", unitBased: false },
  { id: "virtue-face-neck", category: "Body Contouring", subcategory: "Virtue RF Face", name: "Virtue RF – Face + Neck", priceDisplay: "$950", priceId: "price_1Tz79mRsnDIQtm6c4W8ZOBN5", unitBased: false },
  { id: "virtue-face-neck-chest", category: "Body Contouring", subcategory: "Virtue RF Face", name: "Virtue RF – Face + Neck + Chest", priceDisplay: "$1,100", priceId: "price_1Tz79mRsnDIQtm6cv0wzV3ie", unitBased: false },

  // ---------------- BODY CONTOURING: VIRTUE RF BODY ----------------
  { id: "virtue-arms", category: "Body Contouring", subcategory: "Virtue RF Body", name: "Virtue RF – Arms", priceDisplay: "$1,150", priceId: "price_1Tz79mRsnDIQtm6cDrgR2Z6N", unitBased: false },
  { id: "virtue-abdomen", category: "Body Contouring", subcategory: "Virtue RF Body", name: "Virtue RF – Abdomen", priceDisplay: "$1,400", priceId: "price_1Tz79nRsnDIQtm6cJWM6QkTT", unitBased: false },
  { id: "virtue-thighs", category: "Body Contouring", subcategory: "Virtue RF Body", name: "Virtue RF – Thighs", priceDisplay: "$1,400", priceId: "price_1Tz79nRsnDIQtm6chZNO5Azb", unitBased: false },
  { id: "virtue-buttox", category: "Body Contouring", subcategory: "Virtue RF Body", name: "Virtue RF – Buttox", priceDisplay: "$1,400", priceId: "price_1Tz79nRsnDIQtm6c9DNE8yEm", unitBased: false },
  { id: "virtue-scars", category: "Body Contouring", subcategory: "Virtue RF Body", name: "Virtue RF – Scars", priceDisplay: "$750", priceId: "price_1Tz79oRsnDIQtm6cyCL4pZZO", unitBased: false },
  { id: "virtue-stretch-marks", category: "Body Contouring", subcategory: "Virtue RF Body", name: "Virtue RF – Stretch Marks", priceDisplay: "$1,150", priceId: "price_1Tz79oRsnDIQtm6c5UVF3UaN", unitBased: false },
  { id: "virtue-submental", category: "Body Contouring", subcategory: "Virtue RF Body", name: "Virtue RF – Submental (Under Chin)", priceDisplay: "$550", priceId: "price_1Tz79pRsnDIQtm6cVLbsw885", unitBased: false },

  // ---------------- SKIN: VI PEEL ----------------
  { id: "vi-peel", category: "Skin Treatments", subcategory: "VI Peel", name: "VI Peel", priceDisplay: "$350", priceId: "price_1Tz79pRsnDIQtm6cZTGXHn1y", unitBased: false },
  { id: "vi-peel-advanced", category: "Skin Treatments", subcategory: "VI Peel", name: "VI Peel Advanced", priceDisplay: "$350", priceId: "price_1Tz79pRsnDIQtm6cu1sJvkar", unitBased: false },
  { id: "vi-peel-precision-plus", category: "Skin Treatments", subcategory: "VI Peel", name: "VI Peel Precision Plus", priceDisplay: "$350", priceId: "price_1Tz79qRsnDIQtm6cbcKksT4E", unitBased: false },
  { id: "vi-peel-purify", category: "Skin Treatments", subcategory: "VI Peel", name: "VI Peel Purify", priceDisplay: "$350", priceId: "price_1Tz79qRsnDIQtm6cLsokzkdz", unitBased: false },
  { id: "vi-peel-purify-precision", category: "Skin Treatments", subcategory: "VI Peel", name: "VI Peel Purify w/ Precision Plus", priceDisplay: "$350", priceId: "price_1Tz79qRsnDIQtm6ce7MMYWlB", unitBased: false },
  { id: "vi-peel-body-small", category: "Skin Treatments", subcategory: "VI Peel", name: "VI Peel Body (Small)", priceDisplay: "$350", priceId: "price_1Tz79rRsnDIQtm6c3o8QbVJF", unitBased: false },
  { id: "vi-peel-body-large", category: "Skin Treatments", subcategory: "VI Peel", name: "VI Peel Body (Large)", priceDisplay: "$450", priceId: "price_1Tz79rRsnDIQtm6cbkCgl4GF", unitBased: false },

  // ---------------- SKIN: FACIALS ----------------
  { id: "facial-signature", category: "Skin Treatments", subcategory: "Facials", name: "Signature Alpha Facial (45 min)", priceDisplay: "$150", priceId: "price_1Tz79rRsnDIQtm6cLb7BqTIT", unitBased: false },
  { id: "facial-sports", category: "Skin Treatments", subcategory: "Facials", name: "Sports Facial (60 min)", priceDisplay: "$140", priceId: "price_1Tz79sRsnDIQtm6cfzIGzlEf", unitBased: false },
  { id: "facial-teen", category: "Skin Treatments", subcategory: "Facials", name: "Teen Facial (30 min)", priceDisplay: "$99", priceId: "price_1Tz79sRsnDIQtm6c56r5RRfB", unitBased: false },

  // ---------------- SKIN: RED LIGHT THERAPY ----------------
  { id: "rlt-single", category: "Skin Treatments", subcategory: "Red Light Therapy", name: "Red Light Therapy – Single Session (20 min)", priceDisplay: "$50", priceId: "price_1Tz79sRsnDIQtm6cP2wh61OP", unitBased: false },
  { id: "rlt-5pack", category: "Skin Treatments", subcategory: "Red Light Therapy", name: "Red Light Therapy – 5 Sessions", priceDisplay: "$225", priceId: "price_1Tz79tRsnDIQtm6chy0CrOEo", unitBased: false },
  { id: "rlt-10pack", category: "Skin Treatments", subcategory: "Red Light Therapy", name: "Red Light Therapy – 10 Sessions", priceDisplay: "$400", priceId: "price_1Tz79tRsnDIQtm6cv0oZavNy", unitBased: false },

  // ---------------- SKINCARE PRODUCTS: BRIGHTENING ----------------
  { id: "brightening-4", category: "Skincare Products", subcategory: "Brightening", name: "4% Brightening Pads", priceDisplay: "$61.50", priceId: "price_1Tz79tRsnDIQtm6ccPDhaQtA", unitBased: false },
  { id: "brightening-6", category: "Skincare Products", subcategory: "Brightening", name: "6% Brightening Pads", priceDisplay: "$71.75", priceId: "price_1Tz79uRsnDIQtm6cnyifxYJF", unitBased: false },
  { id: "brightening-8", category: "Skincare Products", subcategory: "Brightening", name: "8% Brightening Pads", priceDisplay: "$82", priceId: "price_1Tz79uRsnDIQtm6c995Edt18", unitBased: false },
  { id: "brightening-pads", category: "Skincare Products", subcategory: "Brightening", name: "Brightening Pads", priceDisplay: "$41", priceId: "price_1Tz79uRsnDIQtm6cRuEAoUDF", unitBased: false },

  // ---------------- SKINCARE PRODUCTS: CLEANSERS ----------------
  { id: "cleanser-papaya", category: "Skincare Products", subcategory: "Cleansers", name: "Clear Papaya Cleanser", priceDisplay: "$17", priceId: "price_1Tz79vRsnDIQtm6c7gtCYjKh", unitBased: false },
  { id: "cleanser-green-tea", category: "Skincare Products", subcategory: "Cleansers", name: "Gentle Green Tea Cleanser", priceDisplay: "$22", priceId: "price_1Tz79vRsnDIQtm6caK4fG5YS", unitBased: false },

  // ---------------- SKINCARE PRODUCTS: SERUMS & TREATMENTS ----------------
  { id: "serum-collagen-vitc", category: "Skincare Products", subcategory: "Serums & Treatments", name: "Collagen Vitamin C Serum", priceDisplay: "$66", priceId: "price_1Tz79wRsnDIQtm6coc2gCvTa", unitBased: false },
  { id: "serum-ha", category: "Skincare Products", subcategory: "Serums & Treatments", name: "Firm & Hydrate HA Serum", priceDisplay: "$49", priceId: "price_1Tz79wRsnDIQtm6cZQscVls0", unitBased: false },
  { id: "serum-resurfacing", category: "Skincare Products", subcategory: "Serums & Treatments", name: "Gentle Resurfacing Serum", priceDisplay: "$44.50", priceId: "price_1Tz79wRsnDIQtm6c8NKmdtPK", unitBased: false },
  { id: "serum-peptide-cream", category: "Skincare Products", subcategory: "Serums & Treatments", name: "Peptide Growth Factor Cream", priceDisplay: "$62.50", priceId: "price_1Tz79xRsnDIQtm6cWWxHzhmt", unitBased: false },
  { id: "serum-retinol", category: "Skincare Products", subcategory: "Serums & Treatments", name: "Vita Renew 0.5 Retinol Serum", priceDisplay: "$46", priceId: "price_1Tz79xRsnDIQtm6cmxQOrnYz", unitBased: false },

  // ---------------- SKINCARE PRODUCTS: MOISTURIZERS & EYE CARE ----------------
  { id: "bb-cream", category: "Skincare Products", subcategory: "Moisturizers & Eye Care", name: "Daily Defense BB Cream", priceDisplay: "$23.50", priceId: "price_1Tz79xRsnDIQtm6cl4cKQKhd", unitBased: false },
  { id: "night-moisturizer", category: "Skincare Products", subcategory: "Moisturizers & Eye Care", name: "Night Restore Moisturizer", priceDisplay: "$53", priceId: "price_1Tz79yRsnDIQtm6c0EYU5Ske", unitBased: false },
  { id: "eye-complex", category: "Skincare Products", subcategory: "Moisturizers & Eye Care", name: "Restorative Eye Complex", priceDisplay: "$54", priceId: "price_1Tz79yRsnDIQtm6cjuHl9nSM", unitBased: false },

  // ---------------- SUPPLEMENTS ----------------
  { id: "supp-adk10", category: "Supplements", subcategory: "Supplements", name: "ADK10", priceDisplay: "$24.06", priceId: "price_1Tz79yRsnDIQtm6c0IUDkvui", unitBased: false },
  { id: "supp-adren-all", category: "Supplements", subcategory: "Supplements", name: "Adren-All", priceDisplay: "$28.45", priceId: "price_1Tz79zRsnDIQtm6cwiYSLhdY", unitBased: false },
  { id: "supp-arnicare", category: "Supplements", subcategory: "Supplements", name: "Arnicare Gel & Oral Pellets", priceDisplay: "$12.23", priceId: "price_1Tz79zRsnDIQtm6cmtfr5F6X", unitBased: false },
  { id: "supp-bcomplex", category: "Supplements", subcategory: "Supplements", name: "B-Complex", priceDisplay: "$16.89", priceId: "price_1Tz79zRsnDIQtm6cDGQqJim6", unitBased: false },
  { id: "supp-bergamot", category: "Supplements", subcategory: "Supplements", name: "Bergamot BPF (60 cap)", priceDisplay: "$24.15", priceId: "price_1Tz7A0RsnDIQtm6c6WL9kLhu", unitBased: false },
  { id: "supp-bpc157", category: "Supplements", subcategory: "Supplements", name: "BPC-157 LipoTab", priceDisplay: "$75.49", priceId: "price_1Tz7A0RsnDIQtm6ckVvgDqhh", unitBased: false },
  { id: "supp-cmcore", category: "Supplements", subcategory: "Supplements", name: "CM Core (90 cap)", priceDisplay: "$23.35", priceId: "price_1Tz7A1RsnDIQtm6cL9t6P9qV", unitBased: false },
  { id: "supp-corerestore-choc", category: "Supplements", subcategory: "Supplements", name: "CoreRestore Detox Chocolate", priceDisplay: "$57.77", priceId: "price_1Tz7A1RsnDIQtm6cnDtpf427", unitBased: false },
  { id: "supp-corerestore-vanilla", category: "Supplements", subcategory: "Supplements", name: "CoreRestore Detox Vanilla", priceDisplay: "$57.77", priceId: "price_1Tz7A1RsnDIQtm6c7SWvSHUM", unitBased: false },
  { id: "supp-hiphenolic", category: "Supplements", subcategory: "Supplements", name: "HiPhenolic", priceDisplay: "$22.75", priceId: "price_1Tz7A2RsnDIQtm6cgYKaPzb5", unitBased: false },
  { id: "supp-hrt-e", category: "Supplements", subcategory: "Supplements", name: "HRT-Complete E", priceDisplay: "$34.17", priceId: "price_1Tz7A2RsnDIQtm6cTrWX62EY", unitBased: false },
  { id: "supp-hrt-t", category: "Supplements", subcategory: "Supplements", name: "HRT-Complete T", priceDisplay: "$48.25", priceId: "price_1Tz7A2RsnDIQtm6cMb0z6MAO", unitBased: false },
  { id: "supp-orthobiotic", category: "Supplements", subcategory: "Supplements", name: "Ortho Biotic 30 cap", priceDisplay: "$18.60", priceId: "price_1Tz7A3RsnDIQtm6cr26kJmo8", unitBased: false },
  { id: "supp-thyroid", category: "Supplements", subcategory: "Supplements", name: "Thyroid Support", priceDisplay: "$24.07", priceId: "price_1Tz7A3RsnDIQtm6c9k4sf0HP", unitBased: false },

  // ---------------- MEDICAL WEIGHT LOSS ----------------
  { id: "wl-initial-consult", category: "Medical Weight Loss", subcategory: "Consultations & Visits", name: "Initial Consultation", priceDisplay: "$75", priceId: "price_1Tz7A3RsnDIQtm6cTgdLbvyd", unitBased: false },
  { id: "wl-semaglutide-visit", category: "Medical Weight Loss", subcategory: "Consultations & Visits", name: "Semaglutide Visit", priceDisplay: "$350", priceId: "price_1Tz7A4RsnDIQtm6chd0Hzges", unitBased: false },
  { id: "wl-tirzepatide-low", category: "Medical Weight Loss", subcategory: "Consultations & Visits", name: "Tirzepatide Visit (2.5 or 5 mg)", priceDisplay: "$350", priceId: "price_1Tz7A4RsnDIQtm6c1d7RQEe0", unitBased: false },
  { id: "wl-tirzepatide-mid", category: "Medical Weight Loss", subcategory: "Consultations & Visits", name: "Tirzepatide Visit (7.5 or 10 mg)", priceDisplay: "$600", priceId: "price_1Tz7A4RsnDIQtm6cw3MwiNOm", unitBased: false },
  { id: "wl-tirzepatide-high", category: "Medical Weight Loss", subcategory: "Consultations & Visits", name: "Tirzepatide Visit (12.5 or 15 mg)", priceDisplay: "$750", priceId: "price_1Tz7A5RsnDIQtm6c9AeGTJqT", unitBased: false },

  // ---------------- HORMONE & WELLNESS: EVEXIPEL ----------------
  { id: "evexipel-consult", category: "Hormone & Wellness", subcategory: "EvexiPEL", name: "Consultation", priceDisplay: "$75", priceId: "price_1Tz7A5RsnDIQtm6cxrdsMQve", unitBased: false },
  { id: "evexipel-labs-male", category: "Hormone & Wellness", subcategory: "EvexiPEL", name: "Pre-Pellet Labs (Male)", priceDisplay: "$199", priceId: "price_1Tz7A6RsnDIQtm6c6FDzxwce", unitBased: false },
  { id: "evexipel-labs-female", category: "Hormone & Wellness", subcategory: "EvexiPEL", name: "Pre-Pellet Labs (Female)", priceDisplay: "$199", priceId: "price_1Tz7A6RsnDIQtm6cKb11p1Cb", unitBased: false },
  { id: "evexipel-male-procedure", category: "Hormone & Wellness", subcategory: "EvexiPEL", name: "Male Pellets Procedure", priceDisplay: "$699", priceId: "price_1Tz7A6RsnDIQtm6ceRYJvS1i", unitBased: false },
  { id: "evexipel-female-procedure", category: "Hormone & Wellness", subcategory: "EvexiPEL", name: "Female Pellets Procedure", priceDisplay: "$499", priceId: "price_1Tz7A7RsnDIQtm6ca7UA2HXM", unitBased: false },
  // NOTE: "Boost" is listed at $0 on the live site — flagged for owner confirmation.
  // Left OUT of the cart for now since a $0 Stripe Price isn't meaningful to sell.
  // Add back in once a real price (or bundling logic) is confirmed.
  { id: "evexipel-post-labs-male", category: "Hormone & Wellness", subcategory: "EvexiPEL", name: "Post-Pellet Labs (Male)", priceDisplay: "$100", priceId: "price_1Tz7A7RsnDIQtm6ccQUHwaRE", unitBased: false },
  { id: "evexipel-post-labs-female", category: "Hormone & Wellness", subcategory: "EvexiPEL", name: "Post-Pellet Labs (Female)", priceDisplay: "$100", priceId: "price_1Tz7A7RsnDIQtm6coKtXJRJD", unitBased: false },
  { id: "evexipel-followup-t-injection", category: "Hormone & Wellness", subcategory: "EvexiPEL", name: "Follow-Up Testosterone Injection", priceDisplay: "$125", priceId: "price_1Tz7A8RsnDIQtm6cnwKezk1r", unitBased: false },
  { id: "evexipel-t-cypionate", category: "Hormone & Wellness", subcategory: "EvexiPEL", name: "Testosterone Cypionate Injection", priceDisplay: "$25", priceId: "price_1Tz7A8RsnDIQtm6ckRA0EJot", unitBased: false },

  // ---------------- HORMONE & WELLNESS: SERMORELIN ----------------
  { id: "sermorelin-injection", category: "Hormone & Wellness", subcategory: "Sermorelin", name: "Sermorelin Injection", priceDisplay: "$250", priceId: "price_1Tz7A8RsnDIQtm6coysmXPn0", unitBased: false },

  // ---------------- HORMONE & WELLNESS: IV THERAPY ----------------
  { id: "iv-executive", category: "Hormone & Wellness", subcategory: "IV Therapy", name: "Executive IV", priceDisplay: "$219", priceId: "price_1Tz7A9RsnDIQtm6cHfVmal29", unitBased: false },
  { id: "iv-natural-defense", category: "Hormone & Wellness", subcategory: "IV Therapy", name: "Natural Defense IV", priceDisplay: "$325", priceId: "price_1Tz7A9RsnDIQtm6c78xZ3gBu", unitBased: false },
  { id: "iv-glutathione-addon", category: "Hormone & Wellness", subcategory: "IV Therapy", name: "Glutathione Add-On", priceDisplay: "$25", priceId: "price_1Tz7A9RsnDIQtm6ckpNb7Hut", unitBased: false },
  { id: "iv-amino-addon", category: "Hormone & Wellness", subcategory: "IV Therapy", name: "Amino Blend Add-On", priceDisplay: "$25", priceId: "price_1Tz7AARsnDIQtm6cIr9hrxL7", unitBased: false },
];

// Make available globally (plain script include, no bundler)
window.ALPHA_PRODUCTS = ALPHA_PRODUCTS;
