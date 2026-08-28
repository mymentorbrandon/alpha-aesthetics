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
  { id: "dysport-unit", category: "Injectables", subcategory: "Neurotoxins", name: "Dysport (per unit)", priceDisplay: "$10/unit", priceId: "price_1U3D44RoQmeJ4W3Hx5t6hEHD", unitBased: true },
  { id: "botox-unit", category: "Injectables", subcategory: "Neurotoxins", name: "Botox (per unit)", priceDisplay: "$11/unit", priceId: "price_1U3D45RoQmeJ4W3HoaRaDzD2", unitBased: true },

  // ---------------- INJECTABLES: RESTYLANE FILLERS ----------------
  { id: "restylane-lyft", category: "Injectables", subcategory: "Restylane Fillers", name: "Restylane Lyft", priceDisplay: "$750", priceId: "price_1U3D46RoQmeJ4W3Hj7WkTpZn", unitBased: false },
  { id: "restylane-defyne", category: "Injectables", subcategory: "Restylane Fillers", name: "Restylane Defyne", priceDisplay: "$750", priceId: "price_1U3D48RoQmeJ4W3HbebuagW6", unitBased: false },
  { id: "restylane-refine", category: "Injectables", subcategory: "Restylane Fillers", name: "Restylane Refine", priceDisplay: "$600", priceId: "price_1U3D49RoQmeJ4W3HAAmejGXc", unitBased: false },
  { id: "restylane-contour", category: "Injectables", subcategory: "Restylane Fillers", name: "Restylane Contour", priceDisplay: "$750", priceId: "price_1U3D4ARoQmeJ4W3HQ4lfUYee", unitBased: false },
  { id: "restylane-l", category: "Injectables", subcategory: "Restylane Fillers", name: "Restylane-L", priceDisplay: "$700", priceId: "price_1U3D4BRoQmeJ4W3H9ei2HYFM", unitBased: false },

  // ---------------- INJECTABLES: PDO THREAD LIFT ----------------
  // NOTE: several of these show a discounted price on the site (e.g. "$725 / disc. $500").
  // Using the STANDARD price below by default — confirm with owner which price should
  // actually be charged before going live, then update priceDisplay + the Stripe Price.
  { id: "pdo-full", category: "Injectables", subcategory: "PDO Thread Lift", name: "Full PDO Thread Lift", priceDisplay: "$2,500 (ask about disc. $2,000)", priceId: "price_1U3D4CRoQmeJ4W3H6FEklTZT", unitBased: false },
  { id: "pdo-nasolabial", category: "Injectables", subcategory: "PDO Thread Lift", name: "Smooth Lift – Nasolabial", priceDisplay: "$725 (ask about disc. $500)", priceId: "price_1U3D4ERoQmeJ4W3HgdB63GZM", unitBased: false },
  { id: "pdo-marionette", category: "Injectables", subcategory: "PDO Thread Lift", name: "Smooth Lift – Marionette", priceDisplay: "$500 (ask about disc. $375)", priceId: "price_1U3D4FRoQmeJ4W3HTKloQl8k", unitBased: false },
  { id: "pdo-eye-trough", category: "Injectables", subcategory: "PDO Thread Lift", name: "Smooth Lift – Eye Trough", priceDisplay: "$500 (ask about disc. $375)", priceId: "price_1U3D4GRoQmeJ4W3HfGV1T780", unitBased: false },
  { id: "pdo-lips", category: "Injectables", subcategory: "PDO Thread Lift", name: "Smooth Lift – Lips", priceDisplay: "$375 (ask about disc. $250)", priceId: "price_1U3D4HRoQmeJ4W3HDfh9z4oP", unitBased: false },

  // ---------------- BODY CONTOURING: PHYSIQ ----------------
  { id: "physiq-5session", category: "Body Contouring", subcategory: "PHYSIQ", name: "PHYSIQ 5-Session Package", priceDisplay: "$3,000", priceId: "price_1U3D4JRoQmeJ4W3HENp6Dy4K", unitBased: false },
  { id: "physiq-single", category: "Body Contouring", subcategory: "PHYSIQ", name: "PHYSIQ Single Session", priceDisplay: "$600", priceId: "price_1U3D4KRoQmeJ4W3HWrhaJF5x", unitBased: false },

  // ---------------- BODY CONTOURING: VIRTUE RF FACE ----------------
  // Source: in-office price sheet (not currently listed on the website)
  { id: "virtue-face", category: "Body Contouring", subcategory: "Virtue RF Face", name: "Virtue RF – Face", priceDisplay: "$750", priceId: "price_1U3D4LRoQmeJ4W3HrYdPQf6x", unitBased: false },
  { id: "virtue-face-neck", category: "Body Contouring", subcategory: "Virtue RF Face", name: "Virtue RF – Face + Neck", priceDisplay: "$950", priceId: "price_1U3D4NRoQmeJ4W3HBfiXzLM7", unitBased: false },
  { id: "virtue-face-neck-chest", category: "Body Contouring", subcategory: "Virtue RF Face", name: "Virtue RF – Face + Neck + Chest", priceDisplay: "$1,100", priceId: "price_1U3D4ORoQmeJ4W3H1S2DXJVU", unitBased: false },

  // ---------------- BODY CONTOURING: VIRTUE RF BODY ----------------
  { id: "virtue-arms", category: "Body Contouring", subcategory: "Virtue RF Body", name: "Virtue RF – Arms", priceDisplay: "$1,150", priceId: "price_1U3D4PRoQmeJ4W3HXMqoidny", unitBased: false },
  { id: "virtue-abdomen", category: "Body Contouring", subcategory: "Virtue RF Body", name: "Virtue RF – Abdomen", priceDisplay: "$1,400", priceId: "price_1U3D4QRoQmeJ4W3H1VHc0Y7H", unitBased: false },
  { id: "virtue-thighs", category: "Body Contouring", subcategory: "Virtue RF Body", name: "Virtue RF – Thighs", priceDisplay: "$1,400", priceId: "price_1U3D4SRoQmeJ4W3HZxJLwmOy", unitBased: false },
  { id: "virtue-buttox", category: "Body Contouring", subcategory: "Virtue RF Body", name: "Virtue RF – Buttox", priceDisplay: "$1,400", priceId: "price_1U3D4TRoQmeJ4W3H88QEOcYG", unitBased: false },
  { id: "virtue-scars", category: "Body Contouring", subcategory: "Virtue RF Body", name: "Virtue RF – Scars", priceDisplay: "$750", priceId: "price_1U3D4URoQmeJ4W3HnbKoCNay", unitBased: false },
  { id: "virtue-stretch-marks", category: "Body Contouring", subcategory: "Virtue RF Body", name: "Virtue RF – Stretch Marks", priceDisplay: "$1,150", priceId: "price_1U3D4WRoQmeJ4W3HqubICdAl", unitBased: false },
  { id: "virtue-submental", category: "Body Contouring", subcategory: "Virtue RF Body", name: "Virtue RF – Submental (Under Chin)", priceDisplay: "$550", priceId: "price_1U3D4XRoQmeJ4W3HgWW5C77J", unitBased: false },

  // ---------------- SKIN: VI PEEL ----------------
  { id: "vi-peel", category: "Skin Treatments", subcategory: "VI Peel", name: "VI Peel", priceDisplay: "$350", priceId: "price_1U3D4YRoQmeJ4W3HxiFRnIWA", unitBased: false },
  { id: "vi-peel-advanced", category: "Skin Treatments", subcategory: "VI Peel", name: "VI Peel Advanced", priceDisplay: "$350", priceId: "price_1U3D4ZRoQmeJ4W3HPx86ryRz", unitBased: false },
  { id: "vi-peel-precision-plus", category: "Skin Treatments", subcategory: "VI Peel", name: "VI Peel Precision Plus", priceDisplay: "$350", priceId: "price_1U3D4aRoQmeJ4W3HWJQKXpl2", unitBased: false },
  { id: "vi-peel-purify", category: "Skin Treatments", subcategory: "VI Peel", name: "VI Peel Purify", priceDisplay: "$350", priceId: "price_1U3D4cRoQmeJ4W3HWdJJJm4A", unitBased: false },
  { id: "vi-peel-purify-precision", category: "Skin Treatments", subcategory: "VI Peel", name: "VI Peel Purify w/ Precision Plus", priceDisplay: "$350", priceId: "price_1U3D4dRoQmeJ4W3HIXSZhcJ4", unitBased: false },
  { id: "vi-peel-body-small", category: "Skin Treatments", subcategory: "VI Peel", name: "VI Peel Body (Small)", priceDisplay: "$350", priceId: "price_1U3D4eRoQmeJ4W3H2dsXt5Wq", unitBased: false },
  { id: "vi-peel-body-large", category: "Skin Treatments", subcategory: "VI Peel", name: "VI Peel Body (Large)", priceDisplay: "$450", priceId: "price_1U3D4fRoQmeJ4W3HEobuvHnx", unitBased: false },

  // ---------------- SKIN: FACIALS ----------------
  { id: "facial-signature", category: "Skin Treatments", subcategory: "Facials", name: "Signature Alpha Facial (45 min)", priceDisplay: "$150", priceId: "price_1U3D4hRoQmeJ4W3HUZd7XbJw", unitBased: false },
  { id: "facial-sports", category: "Skin Treatments", subcategory: "Facials", name: "Sports Facial (60 min)", priceDisplay: "$140", priceId: "price_1U3D4iRoQmeJ4W3H8G7xg9oF", unitBased: false },
  { id: "facial-teen", category: "Skin Treatments", subcategory: "Facials", name: "Teen Facial (30 min)", priceDisplay: "$99", priceId: "price_1U3D4jRoQmeJ4W3HV4UzFwzS", unitBased: false },

  // ---------------- SKIN: RED LIGHT THERAPY ----------------
  { id: "rlt-single", category: "Skin Treatments", subcategory: "Red Light Therapy", name: "Red Light Therapy – Single Session (20 min)", priceDisplay: "$50", priceId: "price_1U3D4kRoQmeJ4W3H5cHJqBxp", unitBased: false },
  { id: "rlt-5pack", category: "Skin Treatments", subcategory: "Red Light Therapy", name: "Red Light Therapy – 5 Sessions", priceDisplay: "$225", priceId: "price_1U3D4mRoQmeJ4W3Hi6pNeNPl", unitBased: false },
  { id: "rlt-10pack", category: "Skin Treatments", subcategory: "Red Light Therapy", name: "Red Light Therapy – 10 Sessions", priceDisplay: "$400", priceId: "price_1U3D4nRoQmeJ4W3HyD0yU74f", unitBased: false },

  // ---------------- SKINCARE PRODUCTS: BRIGHTENING ----------------
  { id: "brightening-4", category: "Skincare Products", subcategory: "Brightening", name: "4% Brightening Pads", priceDisplay: "$61.50", priceId: "price_1U3D4oRoQmeJ4W3HRd4x2UZo", unitBased: false },
  { id: "brightening-6", category: "Skincare Products", subcategory: "Brightening", name: "6% Brightening Pads", priceDisplay: "$71.75", priceId: "price_1U3D4pRoQmeJ4W3H3ynKyOvS", unitBased: false },
  { id: "brightening-8", category: "Skincare Products", subcategory: "Brightening", name: "8% Brightening Pads", priceDisplay: "$82", priceId: "price_1U3D4qRoQmeJ4W3HxP9msLvY", unitBased: false },
  { id: "brightening-pads", category: "Skincare Products", subcategory: "Brightening", name: "Brightening Pads", priceDisplay: "$41", priceId: "price_1U3D4sRoQmeJ4W3HOFy4Ev5s", unitBased: false },

  // ---------------- SKINCARE PRODUCTS: CLEANSERS ----------------
  { id: "cleanser-papaya", category: "Skincare Products", subcategory: "Cleansers", name: "Clear Papaya Cleanser", priceDisplay: "$17", priceId: "price_1U3D4tRoQmeJ4W3HEwnUsbXX", unitBased: false },
  { id: "cleanser-green-tea", category: "Skincare Products", subcategory: "Cleansers", name: "Gentle Green Tea Cleanser", priceDisplay: "$22", priceId: "price_1U3D4uRoQmeJ4W3Hzgr66129", unitBased: false },

  // ---------------- SKINCARE PRODUCTS: SERUMS & TREATMENTS ----------------
  { id: "serum-collagen-vitc", category: "Skincare Products", subcategory: "Serums & Treatments", name: "Collagen Vitamin C Serum", priceDisplay: "$66", priceId: "price_1U3D4vRoQmeJ4W3H8w194K5t", unitBased: false },
  { id: "serum-ha", category: "Skincare Products", subcategory: "Serums & Treatments", name: "Firm & Hydrate HA Serum", priceDisplay: "$49", priceId: "price_1U3D4wRoQmeJ4W3HhpfALOya", unitBased: false },
  { id: "serum-resurfacing", category: "Skincare Products", subcategory: "Serums & Treatments", name: "Gentle Resurfacing Serum", priceDisplay: "$44.50", priceId: "price_1U3D4yRoQmeJ4W3HMRfvFJey", unitBased: false },
  { id: "serum-peptide-cream", category: "Skincare Products", subcategory: "Serums & Treatments", name: "Peptide Growth Factor Cream", priceDisplay: "$62.50", priceId: "price_1U3D4zRoQmeJ4W3HMCdct7gl", unitBased: false },
  { id: "serum-retinol", category: "Skincare Products", subcategory: "Serums & Treatments", name: "Vita Renew 0.5 Retinol Serum", priceDisplay: "$46", priceId: "price_1U3D50RoQmeJ4W3H1EOf2ewW", unitBased: false },

  // ---------------- SKINCARE PRODUCTS: MOISTURIZERS & EYE CARE ----------------
  { id: "bb-cream", category: "Skincare Products", subcategory: "Moisturizers & Eye Care", name: "Daily Defense BB Cream", priceDisplay: "$23.50", priceId: "price_1U3D51RoQmeJ4W3HNDbYTYLf", unitBased: false },
  { id: "night-moisturizer", category: "Skincare Products", subcategory: "Moisturizers & Eye Care", name: "Night Restore Moisturizer", priceDisplay: "$53", priceId: "price_1U3D53RoQmeJ4W3HP4eKZbS5", unitBased: false },
  { id: "eye-complex", category: "Skincare Products", subcategory: "Moisturizers & Eye Care", name: "Restorative Eye Complex", priceDisplay: "$54", priceId: "price_1U3D54RoQmeJ4W3HYXcsiGxs", unitBased: false },

  // ---------------- SUPPLEMENTS ----------------
  { id: "supp-adk10", category: "Supplements", subcategory: "Supplements", name: "ADK10", priceDisplay: "$24.06", priceId: "price_1U3D55RoQmeJ4W3HMBIKvjNV", unitBased: false },
  { id: "supp-adren-all", category: "Supplements", subcategory: "Supplements", name: "Adren-All", priceDisplay: "$28.45", priceId: "price_1U3D56RoQmeJ4W3H1QkVwuBn", unitBased: false },
  { id: "supp-arnicare", category: "Supplements", subcategory: "Supplements", name: "Arnicare Gel & Oral Pellets", priceDisplay: "$12.23", priceId: "price_1U3D58RoQmeJ4W3Htd5TUi7X", unitBased: false },
  { id: "supp-bcomplex", category: "Supplements", subcategory: "Supplements", name: "B-Complex", priceDisplay: "$16.89", priceId: "price_1U3D59RoQmeJ4W3HkDGYNKqe", unitBased: false },
  { id: "supp-bergamot", category: "Supplements", subcategory: "Supplements", name: "Bergamot BPF (60 cap)", priceDisplay: "$24.15", priceId: "price_1U3D5ARoQmeJ4W3HhW5CN77v", unitBased: false },
  { id: "supp-bpc157", category: "Supplements", subcategory: "Supplements", name: "BPC-157 LipoTab", priceDisplay: "$75.49", priceId: "price_1U3D5BRoQmeJ4W3HSjByYn4z", unitBased: false },
  { id: "supp-cmcore", category: "Supplements", subcategory: "Supplements", name: "CM Core (90 cap)", priceDisplay: "$23.35", priceId: "price_1U3D5DRoQmeJ4W3HwtPIIJea", unitBased: false },
  { id: "supp-corerestore-choc", category: "Supplements", subcategory: "Supplements", name: "CoreRestore Detox Chocolate", priceDisplay: "$57.77", priceId: "price_1U3D5ERoQmeJ4W3HAxulGpoD", unitBased: false },
  { id: "supp-corerestore-vanilla", category: "Supplements", subcategory: "Supplements", name: "CoreRestore Detox Vanilla", priceDisplay: "$57.77", priceId: "price_1U3D5FRoQmeJ4W3HtSdxmpAW", unitBased: false },
  { id: "supp-hiphenolic", category: "Supplements", subcategory: "Supplements", name: "HiPhenolic", priceDisplay: "$22.75", priceId: "price_1U3D5GRoQmeJ4W3HtSTnfEaT", unitBased: false },
  { id: "supp-hrt-e", category: "Supplements", subcategory: "Supplements", name: "HRT-Complete E", priceDisplay: "$34.17", priceId: "price_1U3D5HRoQmeJ4W3H4IA5UXJc", unitBased: false },
  { id: "supp-hrt-t", category: "Supplements", subcategory: "Supplements", name: "HRT-Complete T", priceDisplay: "$48.25", priceId: "price_1U3D5JRoQmeJ4W3HOhLpzgpZ", unitBased: false },
  { id: "supp-orthobiotic", category: "Supplements", subcategory: "Supplements", name: "Ortho Biotic 30 cap", priceDisplay: "$18.60", priceId: "price_1U3D5KRoQmeJ4W3HYUZt4Lvg", unitBased: false },
  { id: "supp-thyroid", category: "Supplements", subcategory: "Supplements", name: "Thyroid Support", priceDisplay: "$24.07", priceId: "price_1U3D5LRoQmeJ4W3HJTCpv6P9", unitBased: false },

  // ---------------- MEDICAL WEIGHT LOSS ----------------
  { id: "wl-initial-consult", category: "Medical Weight Loss", subcategory: "Consultations & Visits", name: "Initial Consultation", priceDisplay: "$75", priceId: "price_1U3D5MRoQmeJ4W3Hrp6Oi6SX", unitBased: false },
  { id: "wl-semaglutide-visit", category: "Medical Weight Loss", subcategory: "Consultations & Visits", name: "Semaglutide Visit", priceDisplay: "$350", priceId: "price_1U3D5ORoQmeJ4W3HUO3nq6Og", unitBased: false },
  { id: "wl-tirzepatide-low", category: "Medical Weight Loss", subcategory: "Consultations & Visits", name: "Tirzepatide Visit (2.5 or 5 mg)", priceDisplay: "$350", priceId: "price_1U3D5PRoQmeJ4W3HjdisQJWs", unitBased: false },
  { id: "wl-tirzepatide-mid", category: "Medical Weight Loss", subcategory: "Consultations & Visits", name: "Tirzepatide Visit (7.5 or 10 mg)", priceDisplay: "$600", priceId: "price_1U3D5QRoQmeJ4W3HAUTKHGBP", unitBased: false },
  { id: "wl-tirzepatide-high", category: "Medical Weight Loss", subcategory: "Consultations & Visits", name: "Tirzepatide Visit (12.5 or 15 mg)", priceDisplay: "$750", priceId: "price_1U3D5RRoQmeJ4W3H7EcBD4KV", unitBased: false },

  // ---------------- HORMONE & WELLNESS: EVEXIPEL ----------------
  { id: "evexipel-consult", category: "Hormone & Wellness", subcategory: "EvexiPEL", name: "Consultation", priceDisplay: "$75", priceId: "price_1U3D5TRoQmeJ4W3HkRdks5I8", unitBased: false },
  { id: "evexipel-labs-male", category: "Hormone & Wellness", subcategory: "EvexiPEL", name: "Pre-Pellet Labs (Male)", priceDisplay: "$199", priceId: "price_1U3D5URoQmeJ4W3HYvfVexeG", unitBased: false },
  { id: "evexipel-labs-female", category: "Hormone & Wellness", subcategory: "EvexiPEL", name: "Pre-Pellet Labs (Female)", priceDisplay: "$199", priceId: "price_1U3D5VRoQmeJ4W3HjtB1hHt8", unitBased: false },
  { id: "evexipel-male-procedure", category: "Hormone & Wellness", subcategory: "EvexiPEL", name: "Male Pellets Procedure", priceDisplay: "$699", priceId: "price_1U3D5WRoQmeJ4W3HU4BzkBVc", unitBased: false },
  { id: "evexipel-female-procedure", category: "Hormone & Wellness", subcategory: "EvexiPEL", name: "Female Pellets Procedure", priceDisplay: "$499", priceId: "price_1U3D5YRoQmeJ4W3H53VMErrV", unitBased: false },
  // NOTE: "Boost" is listed at $0 on the live site — flagged for owner confirmation.
  // Left OUT of the cart for now since a $0 Stripe Price isn't meaningful to sell.
  // Add back in once a real price (or bundling logic) is confirmed.
  { id: "evexipel-post-labs-male", category: "Hormone & Wellness", subcategory: "EvexiPEL", name: "Post-Pellet Labs (Male)", priceDisplay: "$100", priceId: "price_1U3D5ZRoQmeJ4W3HspuxoHnx", unitBased: false },
  { id: "evexipel-post-labs-female", category: "Hormone & Wellness", subcategory: "EvexiPEL", name: "Post-Pellet Labs (Female)", priceDisplay: "$100", priceId: "price_1U3D5aRoQmeJ4W3HYZxsslc9", unitBased: false },
  { id: "evexipel-followup-t-injection", category: "Hormone & Wellness", subcategory: "EvexiPEL", name: "Follow-Up Testosterone Injection", priceDisplay: "$125", priceId: "price_1U3D5bRoQmeJ4W3HOTFYg9Ke", unitBased: false },
  { id: "evexipel-t-cypionate", category: "Hormone & Wellness", subcategory: "EvexiPEL", name: "Testosterone Cypionate Injection", priceDisplay: "$25", priceId: "price_1U3D5dRoQmeJ4W3H2wFTHaD9", unitBased: false },

  // ---------------- HORMONE & WELLNESS: SERMORELIN ----------------
  { id: "sermorelin-injection", category: "Hormone & Wellness", subcategory: "Sermorelin", name: "Sermorelin Injection", priceDisplay: "$250", priceId: "price_1U3D5eRoQmeJ4W3HVlscvBNA", unitBased: false },

  // ---------------- HORMONE & WELLNESS: IV THERAPY ----------------
  { id: "iv-executive", category: "Hormone & Wellness", subcategory: "IV Therapy", name: "Executive IV", priceDisplay: "$219", priceId: "price_1U3D5fRoQmeJ4W3HbltkNSoi", unitBased: false },
  { id: "iv-natural-defense", category: "Hormone & Wellness", subcategory: "IV Therapy", name: "Natural Defense IV", priceDisplay: "$325", priceId: "price_1U3D5gRoQmeJ4W3Hj1u3nEIY", unitBased: false },
  { id: "iv-glutathione-addon", category: "Hormone & Wellness", subcategory: "IV Therapy", name: "Glutathione Add-On", priceDisplay: "$25", priceId: "price_1U3D5iRoQmeJ4W3HnPr697WO", unitBased: false },
  { id: "iv-amino-addon", category: "Hormone & Wellness", subcategory: "IV Therapy", name: "Amino Blend Add-On", priceDisplay: "$25", priceId: "price_1U3D5jRoQmeJ4W3HKsOWXDNn", unitBased: false },

  { id: "muse-consult", category: "Consultations", subcategory: "MUSE Cell", name: "MUSE Cell Consultation Deposit", priceDisplay: "$75", priceId: "price_1U3wu0RoQmeJ4W3H8KPQZUXP", unitBased: false },
{ id: "peptide-education-session", category: "Consultations", subcategory: "Education", name: "Peptide Compounding Education Session", priceDisplay: "$75", priceId: "price_1U5VAeRoQmeJ4W3HIf7fkmxv", unitBased: false },
];

// Make available globally (plain script include, no bundler). The Node guard
// lets the serverless functions require this file as the one catalog, so the
// server never has to trust the browser about what a price ID actually is.
if (typeof window !== "undefined") window.ALPHA_PRODUCTS = ALPHA_PRODUCTS;
if (typeof module !== "undefined") module.exports = { ALPHA_PRODUCTS };
