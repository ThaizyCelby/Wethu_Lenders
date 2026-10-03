// ==================== Wethu Micro Lenders – Main Script ====================
// Handles: mobile menu, FAQ accordion, loan calculator, WhatsApp form,
// back-to-top, scroll progress, scroll reveal, testimonial carousel, footer year.
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
        if (window.console && console.error) {
            console.error("[Wethu] config.js missing — WhatsApp CTAs disabled.");
        }
        return;
    }

    // ---------- Helpers ----------

    function normaliseSAPhone(raw) {
        if (typeof raw !== "string") return null;
        var digits = raw.replace(/[^\d]/g, "");
        if (digits.indexOf("27") === 0 && digits.length === 11) digits = digits.slice(2);
        else if (digits.charAt(0) === "0" && digits.length === 10) digits = digits.slice(1);
        if (digits.length !== 9) return null;
        return "27" + digits;
    }

    function clampAmount(raw) {
        var n = Number(raw);
        if (!isFinite(n)) return null;
        n = Math.trunc(n);
        var step = CFG.loan.step || 1;
        n = Math.round(n / step) * step;
        if (n < CFG.loan.min) n = CFG.loan.min;
        if (n > CFG.loan.max) n = CFG.loan.max;
        return n;
    }

    function setText(el, text) {
        if (el) el.textContent = String(text);
    }

    function formatRand(value) {
        var n = Math.round(value);
        return "R" + n.toLocaleString("en-ZA");
    }

    function buildWhatsAppUrl(message) {
        var safe = String(message).slice(0, 1000);
        return "https://wa.me/" + CFG.whatsappE164 + "?text=" + encodeURIComponent(safe);
    }

    function openWhatsApp(message) {
        window.location.href = buildWhatsAppUrl(message);
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
        document.addEventListener("keydown", function (e) {
            if (e.key === "Escape") setMenu(false);
        });
    }

    // ---------- Navbar scroll ----------
    var navbar = document.getElementById("navbar");
    var scrollProgress = document.getElementById("scrollProgress");
    var ticking = false;

    function onScroll() {
        var y = window.scrollY || window.pageYOffset;

        if (navbar) navbar.classList.toggle("scrolled", y > 50);

        if (backToTop) backToTop.classList.toggle("visible", y > 400);

        if (scrollProgress) {
            var doc = document.documentElement;
            var total = (doc.scrollHeight - doc.clientHeight) || 1;
            var pct = Math.min(100, Math.max(0, (y / total) * 100));
            scrollProgress.style.width = pct.toFixed(2) + "%";
        }
        ticking = false;
    }

    window.addEventListener("scroll", function () {
        if (!ticking) {
            window.requestAnimationFrame(onScroll);
            ticking = true;
        }
    }, { passive: true });

    // ---------- Back to top ----------
    var backToTop = document.getElementById("backToTop");
    if (backToTop) {
        backToTop.addEventListener("click", function (e) {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }

    // Initial paint (in case user reloads mid-page)
    onScroll();

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

            var message =
                "Hi Wethu Micro Lenders, I would like to apply for a loan.\n\n" +
                "Name: " + name + "\n" +
                "Contact number: " + phoneRaw + "\n" +
                "Requested amount: R" + amount.toLocaleString("en-ZA") + "\n\n" +
                "I understand this is an enquiry and final terms are subject to " +
                "affordability assessment and credit profile under the National Credit Act.";

            setText(statusEl, "Opening WhatsApp…");

            if (nameEl) nameEl.value = "";
            if (phoneEl) phoneEl.value = "";

            openWhatsApp(message);
        });
    }

    // ---------- Scroll reveal ----------
    (function initReveal() {
        var nodes = document.querySelectorAll(".reveal");
        if (!nodes.length) return;

        if (!("IntersectionObserver" in window)) {
            nodes.forEach(function (n) { n.classList.add("is-visible"); });
            return;
        }

        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-visible");
                    observer.unobserve(entry.target);
                }
            });
        }, { rootMargin: "0px 0px -60px 0px", threshold: 0.08 });

        nodes.forEach(function (n) { observer.observe(n); });
    })();

    // ---------- Testimonial carousel ----------
    (function initCarousel() {
        var carousel = document.querySelector("[data-carousel]");
        if (!carousel) return;

        var track = carousel.querySelector(".testimonial-track");
        var slides = carousel.querySelectorAll("[data-slide]");
        var dotsWrap = carousel.querySelector(".carousel-dots");
        if (!track || !slides.length || !dotsWrap) return;

        var index = 0;
        var total = slides.length;
        var timer = null;

        for (var i = 0; i < total; i++) {
            var dot = document.createElement("button");
            dot.type = "button";
            dot.setAttribute("aria-label", "Show testimonial " + (i + 1));
            dot.setAttribute("role", "tab");
            if (i === 0) dot.classList.add("active");
            dot.addEventListener("click", (function (n) {
                return function () { go(n); };
            })(i));
            dotsWrap.appendChild(dot);
        }

        var dots = dotsWrap.querySelectorAll("button");

        function go(n) {
            index = (n + total) % total;
            track.style.transform = "translateX(-" + (index * 100) + "%)";
            dots.forEach(function (d, i) {
                d.classList.toggle("active", i === index);
            });
        }

        function start() {
            stop();
            timer = window.setInterval(function () {
                go(index + 1);
            }, 6000);
        }

        function stop() {
            if (timer) { window.clearInterval(timer); timer = null; }
        }

        carousel.addEventListener("mouseenter", stop);
        carousel.addEventListener("mouseleave", start);
        carousel.addEventListener("focusin", stop);
        carousel.addEventListener("focusout", start);

        var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (!reduce) start();
    })();

    // ---------- Footer year ----------
    document.querySelectorAll("[data-current-year]").forEach(function (el) {
        el.textContent = String(new Date().getFullYear());
    });
})();