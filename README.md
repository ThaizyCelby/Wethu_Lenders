# Wethu Micro Lenders — Marketing Website

A fast, static, mobile-first marketing website for Wethu Micro Lenders (NCRCP22737),
an NCR-registered micro lender based in Atteridgeville, South Africa.

**Business rule:** This website advertises the business and starts the customer
conversation. The actual loan conversation, ID verification, and any document
exchange happen **directly between the customer and the admin on WhatsApp**.
The website does not collect or store loan applications, ID numbers, or documents.

## Architecture

- Static HTML + CSS + vanilla JavaScript. No backend, no database, no accounts.
- Primary conversion path: **Visitor → Apply page → WhatsApp (wa.me/27723248511)**.
- Only three fields are collected client-side (name, SA mobile, amount), held in
  memory only for the moment needed to build the WhatsApp URL.

## Project structure
