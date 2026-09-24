// Script/config.js
// Single source of truth for Wethu Micro Lenders public configuration.
// This file is PUBLIC — never put secrets, tokens, or private keys here.
//
// IMPORTANT: whatsappE164 is the ONLY trusted WhatsApp destination for the
// main CTA flow. User input must NEVER be able to override it.

window.WETHU_CONFIG = Object.freeze({
  businessName: "Wethu Micro Lenders",
  ncrNumber: "NCRCP22737",

  // Main WhatsApp / phone
  whatsappE164:  "27723248511",        // +27 72 324 8511
  whatsappHuman: "072 324 8511",
  telHref:       "tel:+27723248511",
  email:         "Sales@wethumicrolenders.com",

  // Site
  siteUrl:       "https://wethumicrolenders.co.za",
  address:       "19 Temba Street, Atteridgeville 0125",

  // Named contacts (display + WhatsApp deep links)
  contacts: Object.freeze({
    main: Object.freeze({
      name: "Wethu Micro Lenders",
      role: "Main line",
      whatsappE164: "27723248511",
      whatsappHuman: "072 324 8511"
    }),
    fieldOps: Object.freeze({
      name: "Hleziphi Mudau",
      role: "Field Operations Officer",
      whatsappE164: "27827469784",
      whatsappHuman: "082 746 9784"
    }),
    salesAgent: Object.freeze({
      name: "Mpendulo Shabangu",
      role: "Sales Agent",
      whatsappE164: "27658994026",
      whatsappHuman: "+27 65 899 4026"
    })
  }),

  // Loan product limits (must match NCR-approved product rules)
  loan: Object.freeze({
    min: 500,
    max: 3000,
    step: 50,
    defaultAmount: 1500,
    termDays: 30,
    // Indicative-only illustration factor for the calculator.
    // MUST be confirmed by the business as NCA-compliant, or the calculator
    // should be removed. Never present as a binding quote.
    indicativeRate: 0.30
  })
});