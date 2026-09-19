// Script/config.js
// Single source of truth for Wethu Micro Lenders public configuration.
// This file is PUBLIC — never put secrets, tokens, or private keys here.
//
// IMPORTANT: whatsappE164 is the ONLY trusted WhatsApp destination.
// User input must NEVER be able to override it.

window.WETHU_CONFIG = Object.freeze({
  businessName: "Wethu Micro Lenders",
  ncrNumber: "NCRCP22737",

  // WhatsApp / phone
  whatsappE164:  "27723248511",        // +27 72 324 8511
  whatsappHuman: "072 324 8511",
  telHref:       "tel:+27723248511",
  email:         "Sales@wethumicrolenders.com",

  // Site
  siteUrl:       "https://wethumicrolenders.co.za",
  address:       "19 Temba Street, Atteridgeville 0125",

  // Loan product limits (must match NCR-approved product rules)
  loan: Object.freeze({
    min: 500,
    max: 3000,
    step: 50,
    defaultAmount: 1500,
    termDays: 30,
    // Indicative-only illustration factor for the calculator.
    // MUST be replaced by the business with the actual NCA-compliant figure
    // or the calculator must be removed. Never present as a binding quote.
    indicativeRate: 0.30
  })
});