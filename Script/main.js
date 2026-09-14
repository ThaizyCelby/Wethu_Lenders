// ==================== Wethu Micro Lenders – Main Script ====================
// Handles: mobile menu, FAQ accordion, loan calculator, WhatsApp form, back-to-top.
//
// Security principles enforced by this file:
//   - The WhatsApp destination number is hardcoded from WETHU_CONFIG.
//     User input can NEVER change the destination.
//   - All values inserted into DOM use textContent / setAttribute only.
//   - No innerHTML, insertAdjacentHTML, document.write, eval, or new Function.
//   - No localStorage / sessionStorage / cookies are written.
//   - No ID number or sensitive identifier is collected on the client.

(function () {
    "use strict";

    var CFG = window.WETHU_CONFIG;
    if (!CFG) {
        // Fail closed: do not wire up WhatsApp CTAs if config is missing.
        console.error("[Wethu] config.js missing — WhatsApp CTAs disabled.");
        return;
    }

    // ---------- Helpers ----------

    // Normalise a South African mobile number to E.164 digits without '+'.
    // Accepts: 0721234567 / 072 123 4567 / +27 72 123 4567 / 27721234567
    // Returns null if invalid.
    function normaliseSAPhone(raw) {
        if (typeof raw !== "string") return null;
        var digits = raw.replace(/[^\d]/g, "");
        if (digits.indexOf("27") === 0 && digits.length === 11) digits = digits.slice(2);
        else if (digits.charAt(0) === "0" && digits.length === 10) digits = digits.slice(1);
        if (digits.length !== 9) return null;
        return "27" + digits;
    }

    // Clamp a requested loan amount to the configured safe range.
    function clampAmount(raw) {
        var n = Number(raw);
        if (!isFinite(n)) return null;
        n = Math.trunc(n);
        if (n < CFG.loan.min) n = CFG.loan.min;
        if (n > CFG.loan.max) n = CFG.loan.max;
        return n;
    }

    // Safe text setter.
    function setText(el, text) {
        if (el) el.textContent = String(text);
    }

    // Format a rand amount with thousands separators.
    function formatRand(value) {
        var n = Math.round(value);
        return "R" + n.toLocaleString("en-ZA");
    }

    // Build a WhatsApp URL. Destination is fixed. Only the message is user-influenced.
    function buildWhatsAppUrl(message) {
        var safe = String(message).slice(0, 1000);
        return "https://wa.me/" + CFG.whatsappE164 + "?text=" + encodeURIComponent(safe);
    }

    // Safely open a WhatsApp link without leaking window.opener.
    function openWhatsApp(message) {
        var url = buildWhatsAppUrl(message);
        // Same-tab navigation is the safest; we prefer it.
        window.location.href = url;
    }

    // ---------- Mobile menu ----------
    var hamburger = document.getElementById("hamburger");
    var navLinks = document.getElementById("navLinks");
    var overlay = document.getElementById("overlay");

    if (hamburger && navLinks && overlay) {
        var setMenu = function (open) {
            hamburger.classList.toggle("active", open);
            navLinks.classList.toggle("active", open);
            overlay.classList.toggle("active", open);
            hamburger.setAttribute("aria-expanded", open ? "true" : "false");
        };
        hamburger.addEventListener("click", function () {
            setMenu(!navLinks.classList.contains("active"));
        });
        overlay.addEventListener("click", function () { setMenu(false); });
        navLinks.querySelectorAll("a").forEach(function (a) {
            a.addEventListener("click", function () { setMenu(false); });
        });
    }

    // ---------- Navbar scroll ----------
    var navbar = document.getElementById("navbar");
    if (navbar) {
        window.addEventListener("scroll", function () {
            navbar.classList.toggle("scrolled", window.scrollY > 50);
        });
    }

    // ---------- Back to top ----------
    var backToTop = document.getElementById("backToTop");
    if (backToTop) {
        window.addEventListener("scroll", function () {
            backToTop.classList.toggle("visible", window.scrollY > 400);
        });
        backToTop.addEventListener("click", function (e) {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }

    // ---------- FAQ accordion ----------
    document.querySelectorAll(".faq-question").forEach(function (button) {
        button.addEventListener("click", function () {
            var item = button.parentElement;
            var wasActive = item.classList.contains("active");
            document.querySelectorAll(".faq-item.active").forEach(function (openItem) {
                if (openItem !== item) {
                    openItem.classList.remove("active");
                    var q = openItem.querySelector(".faq-question");
                    if (q) q.setAttribute("aria-expanded", "false");
                }
            });
            item.classList.toggle("active", !wasActive);
            button.setAttribute("aria-expanded", String(!wasActive));
        });
    });

    // ---------- Loan calculator ----------
    function initCalculator(cfg) {
        var slider = document.getElementById(cfg.sliderId);
        if (!slider) return;

        var amountEl = document.getElementById(cfg.amountDisplayId);
        var interestEl = document.getElementById(cfg.interestDisplayId);
        var totalEl = document.getElementById(cfg.totalDisplayId);
        var hiddenInput = cfg.hiddenInputId ? document.getElementById(cfg.hiddenInputId) : null;
        var formAmountEl = cfg.formAmountDisplayId ? document.getElementById(cfg.formAmountDisplayId) : null;

        function update() {
            var amount = clampAmount(slider.value);
            if (amount === null) amount = CFG.loan.defaultAmount;

            var interest = Math.round(amount * CFG.loan.indicativeRate);
            var total = amount + interest;

            setText(amountEl, formatRand(amount));
            setText(interestEl, formatRand(interest));
            setText(totalEl, formatRand(total));

            if (hiddenInput) hiddenInput.value = String(amount);
            if (formAmountEl) setText(formAmountEl, formatRand(amount));
        }

        slider.addEventListener("input", update);
        update();
    }

    initCalculator({
        sliderId: "loanAmount",
        amountDisplayId: "amountDisplay",
        interestDisplayId: "interestDisplay",
        totalDisplayId: "totalRepayment"
    });

    initCalculator({
        sliderId: "loanAmountApply",
        amountDisplayId: "amountDisplayApply",
        interestDisplayId: "interestDisplayApply",
        totalDisplayId: "totalRepaymentApply",
        hiddenInputId: "loanAmountValue",
        formAmountDisplayId: "formAmountDisplay"
    });

    // ---------- Apply form → WhatsApp ----------
    var form = document.getElementById("whatsappForm");
    if (form) {
        var statusEl = document.getElementById("applyStatus");
        var nameEl = document.getElementById("fullName");
        var phoneEl = document.getElementById("phoneNumber");
        var amountEl2 = document.getElementById("loanAmountValue");
        var agreeEl = document.getElementById("agreeTerms");

        // Remove any accidental default that would POST anywhere.
        form.setAttribute("novalidate", "");

        form.addEventListener("submit", function (e) {
            e.preventDefault();

            var name = (nameEl && nameEl.value ? nameEl.value : "").trim().slice(0, 80);
            var phoneRaw = (phoneEl && phoneEl.value ? phoneEl.value : "").trim();
            var amount = clampAmount(amountEl2 ? amountEl2.value : CFG.loan.defaultAmount);
            var agreed = !!(agreeEl && agreeEl.checked);

            function fail(msg, focusEl) {
                setText(statusEl, msg);
                if (focusEl && focusEl.focus) focusEl.focus();
            }

            if (name.length < 2) return fail("Please enter your full name.", nameEl);
            if (amount === null) amount = CFG.loan.defaultAmount;

            var phoneE164 = normaliseSAPhone(phoneRaw);
            if (!phoneE164) {
                return fail("Please enter a valid South African mobile number, e.g. 0721234567.", phoneEl);
            }
            if (!agreed) {
                return fail("Please accept the Terms & Conditions and Privacy Policy.");
            }

            // IMPORTANT: no ID number is collected or transmitted.
            // ID verification happens inside the WhatsApp conversation.
            var message =
                "Hi Wethu Micro Lenders, I would like to apply for a loan.\n\n" +
                "Name: " + name + "\n" +
                "Contact number: " + phoneRaw + "\n" +
                "Requested amount: R" + amount.toLocaleString("en-ZA") + "\n\n" +
                "I understand this is an enquiry and final terms are subject to " +
                "affordability assessment under the National Credit Act.";

            setText(statusEl, "Opening WhatsApp…");

            // Wipe sensitive fields from memory before navigating.
            if (nameEl) nameEl.value = "";
            if (phoneEl) phoneEl.value = "";

            openWhatsApp(message);
        });
    }

    // ---------- Footer year ----------
    document.querySelectorAll("[data-current-year]").forEach(function (el) {
        el.textContent = String(new Date().getFullYear());
    });
})();