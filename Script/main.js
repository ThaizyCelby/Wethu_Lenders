// ==================== Wethu Micro Lenders – Main Script ====================
// Handles: mobile menu, FAQ accordion, loan calculator, WhatsApp form, back-to-top

document.addEventListener('DOMContentLoaded', function() {

    // ---------- Mobile Menu Toggle ----------
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
    const overlay = document.getElementById('overlay');

    if (hamburger && navLinks && overlay) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
            overlay.classList.toggle('active');
        });
        overlay.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
            overlay.classList.remove('active');
        });
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
                overlay.classList.remove('active');
            });
        });
    }

    // ---------- Navbar scroll effect ----------
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // ---------- Back to Top Button ----------
    const backToTop = document.getElementById('backToTop');
    if (backToTop) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 400) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        });
        backToTop.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ---------- FAQ Accordion ----------
    document.querySelectorAll('.faq-question').forEach(button => {
        button.addEventListener('click', () => {
            const item = button.parentElement;
            const isActive = item.classList.contains('active');
            document.querySelectorAll('.faq-item.active').forEach(openItem => {
                if (openItem !== item) {
                    openItem.classList.remove('active');
                    openItem.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
                }
            });
            item.classList.toggle('active', !isActive);
            button.setAttribute('aria-expanded', !isActive);
        });
    });

    // ---------- Loan Calculator ----------
    function initCalculator(sliderId, amountDisplayId, interestDisplayId, totalDisplayId, hiddenInputId = null, formAmountDisplayId = null) {
        const slider = document.getElementById(sliderId);
        if (!slider) return;
        const amountDisplay = document.getElementById(amountDisplayId);
        const interestDisplay = document.getElementById(interestDisplayId);
        const totalDisplay = document.getElementById(totalDisplayId);
        const hiddenInput = hiddenInputId ? document.getElementById(hiddenInputId) : null;
        const formAmountDisplay = formAmountDisplayId ? document.getElementById(formAmountDisplayId) : null;

        const updateCalculator = () => {
            const amount = parseInt(slider.value, 10);
            const interest = amount * 0.35;
            const total = amount + interest;
            amountDisplay.textContent = `R${amount.toLocaleString('en-ZA')}`;
            interestDisplay.textContent = `R${interest.toLocaleString('en-ZA', {maximumFractionDigits: 0})}`;
            totalDisplay.textContent = `R${total.toLocaleString('en-ZA', {maximumFractionDigits: 0})}`;
            if (hiddenInput) hiddenInput.value = amount;
            if (formAmountDisplay) formAmountDisplay.textContent = `R${amount.toLocaleString('en-ZA')}`;
        };

        slider.addEventListener('input', updateCalculator);
        updateCalculator();
    }

    initCalculator('loanAmount', 'amountDisplay', 'interestDisplay', 'totalRepayment');
    initCalculator('loanAmountApply', 'amountDisplayApply', 'interestDisplayApply', 'totalRepaymentApply', 'loanAmountValue', 'formAmountDisplay');

    // ---------- WhatsApp Application Form ----------
    const whatsappForm = document.getElementById('whatsappForm');
    if (whatsappForm) {
        whatsappForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const fullName = document.getElementById('fullName').value.trim();
            const idNumber = document.getElementById('idNumber').value.trim();
            const phoneNumber = document.getElementById('phoneNumber').value.trim();
            const loanAmount = document.getElementById('loanAmountValue').value;
            const agreeTerms = document.getElementById('agreeTerms').checked;

            if (!fullName || !idNumber || !phoneNumber || !agreeTerms) {
                alert('Please fill in all fields and agree to the terms.');
                return;
            }

            const message = `Hi Wethu Micro Lenders, I would like to apply for a loan of R${parseInt(loanAmount).toLocaleString('en-ZA')}.\n\nName: ${fullName}\nID: ${idNumber}\nPhone: ${phoneNumber}\n\nI agree to the Terms & Conditions and Privacy Policy.`;
            const encodedMessage = encodeURIComponent(message);
            const waLink = `https://wa.me/27726196719?text=${encodedMessage}`;
            window.open(waLink, '_blank', 'noopener,noreferrer');
        });
    }
});