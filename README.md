# Wethu Micro Lenders — Marketing Website

A **security-hardened static marketing website** for Wethu Micro Lenders
(NCRCP22737), an NCR-registered micro lender based in Atteridgeville,
South Africa.

This is **not** a loan-management system. It advertises the business and starts
the conversation. The actual loan discussion, ID verification, and any document
exchange happen directly between the customer and the admin on WhatsApp.

## Architecture

- Static HTML + CSS + vanilla JavaScript.
- No backend. No database. No user accounts. No file uploads.
- Primary conversion path: **Visitor → Apply page → WhatsApp (wa.me/27723248511)**.
- Only three fields are held (in browser memory, momentarily) to construct the
  WhatsApp message: name, SA mobile, requested amount. Nothing is persisted.

## Project structure
