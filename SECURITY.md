# Security Policy

## Supported Versions

We actively maintain the **production version** of the Wethu Micro Lenders website.  
The following table shows which releases are currently receiving security updates.

| Version | Status              | Notes |
|---------|---------------------|-------|
| 2.x     | ✅ Supported         | Current live site (as of April 2025). |
| 1.x     | ❌ End‑of‑life       | Initial release; no longer maintained. |
| 0.x     | ❌ Pre‑release       | Development only; not audited. |

> **Note:** Because this is a **static website** (no server‑side code, no database), the attack surface is minimal. All logic runs in the user’s browser, and no sensitive data is stored on our origin server.

---

## Reporting a Vulnerability

We take the security of our users and their data extremely seriously.  
If you believe you have found a security vulnerability in our website, **please report it to us immediately**.

### **How to Report**

- **Preferred contact:** WhatsApp at [`072 619 6719`](https://wa.me/27726196719?text=SECURITY%20REPORT%20-%20Wethu%20Micro%20Lenders)  
  (Please start your message with “SECURITY REPORT – Wethu Micro Lenders” to ensure prompt attention.)

- **Alternative:** Open a **private security advisory** on GitHub:  
  Go to the repository’s `Security` tab → `Advisories` → `New draft security advisory`.  
  This keeps the report confidential until resolved.

### **What to Include**

Help us fix the issue quickly by providing:
1. A **clear description** of the vulnerability and its potential impact.
2. **Steps to reproduce** the issue (e.g., which page, which action).
3. Any relevant **screenshots or proof‑of‑concept**.
4. Your **suggested fix** (if you have one).

### **What to Expect**

- **Acknowledgment:** We will reply within **48 hours** to confirm we received your report.
- **Assessment:** Our team will investigate and provide an initial assessment within **5 business days**.
- **Updates:** We will keep you informed regularly (at least weekly) until the issue is resolved.
- **Disclosure:** Once a fix is deployed, we will publish a public advisory (crediting you unless you prefer to remain anonymous).

### **Safe Harbour Policy**

We will not take legal action against you if:
- You make a good‑faith effort to avoid privacy violations, destruction of data, and interruption of service.
- You do not publicly disclose the vulnerability before we have had a reasonable time to address it.
- You comply with all relevant laws.

We **greatly appreciate** responsible disclosure and will publicly acknowledge your contribution if you wish.

---

## Security Best Practices

We have implemented several layers of security to protect our visitors:

| Measure | Description |
|---------|-------------|
| **Content Security Policy (CSP)** | Strict CSP headers prevent cross‑site scripting (XSS) and data injection attacks. |
| **HTTPS Only** | All traffic is forced over HTTPS. Our `Strict-Transport-Security` (HSTS) header tells browsers to always use a secure connection. |
| **No Inline Scripts/CSS** | All JavaScript and CSS are external files. This eliminates a major XSS vector and aligns with our strict CSP. |
| **Subresource Integrity (SRI)** | (If used) External resources like Font Awesome are verified with SRI hashes. |
| **Clickjacking Protection** | The `frame-ancestors 'self'` directive prevents the site from being embedded in malicious frames. |
| **Data Collection** | We do **not** collect or store sensitive information on our origin server. The loan application form is a **Google Form hosted on Google’s secure infrastructure**. |
| **No Third‑Party Trackers** | No analytics or tracking scripts that could leak user data. |
| **Regular Dependency Updates** | We monitor the few external libraries we use (Font Awesome, Google Fonts) and update them promptly. |

Because the site is **fully static** and served through a CDN (Netlify / GitHub Pages), there is no dynamic backend to exploit (no SQL injection, no server‑side code execution).

---

## Contact

For any security‑related questions or to report a vulnerability, please reach out via:

- **WhatsApp:** [`072 867 2014`](https://wa.me/27728672014?text=Security%20concern)  
- **Phone:** `072 867 2014`  
- **GitHub Advisory:** Use the repository’s private advisory system.

Wethu Micro Lenders is fully committed to maintaining a safe and trustworthy platform for all South Africans.

*Last updated: April 2025*
