(function() {
    // Google Forms already embedded in HTML, no extra configuration needed.
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
    const overlay = document.getElementById('overlay');
    const backToTop = document.getElementById('backToTop');
    const allNavLinks = document.querySelectorAll('.nav-links a[data-nav]');
    const allAnchorLinks = document.querySelectorAll('a[href^="#"]');

    function openMenu() {
        navLinks.classList.add('active');
        hamburger.classList.add('active');
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    function closeMenu() {
        navLinks.classList.remove('active');
        hamburger.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    }
    hamburger.addEventListener('click', function() {
        navLinks.classList.contains('active') ? closeMenu() : openMenu();
    });
    overlay.addEventListener('click', closeMenu);
    navLinks.querySelectorAll('a').forEach(function(link) {
        link.addEventListener('click', function() {
            if (navLinks.classList.contains('active')) {
                closeMenu();
            }
        });
    });
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && navLinks.classList.contains('active')) {
            closeMenu();
        }
    });

    allAnchorLinks.forEach(function(link) {
        link.addEventListener('click', function(e) {
            var href = this.getAttribute('href');
            if (href.startsWith('#') && href.length > 1) {
                var target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    var navHeight = navbar.offsetHeight;
                    window.scrollTo({
                        top: target.getBoundingClientRect().top + window.pageYOffset - navHeight - 10,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    function updateActiveNavLink() {
        var sections = document.querySelectorAll('section[id], [id="apply"], [id="contact"]');
        var scrollPos = window.scrollY + navbar.offsetHeight + 100;
        var current = 'home';
        sections.forEach(function(section) {
            var top = section.offsetTop;
            var height = section.offsetHeight;
            if (scrollPos >= top && scrollPos < top + height) {
                current = section.getAttribute('id');
            }
        });
        allNavLinks.forEach(function(link) {
            link.classList.remove('active');
            if (link.getAttribute('data-nav') === current) {
                link.classList.add('active');
            }
        });
    }

    function updateNavbar() {
        navbar.classList.toggle('scrolled', window.scrollY > 20);
    }
    function updateBackToTop() {
        backToTop.classList.toggle('visible', window.scrollY > 500);
    }

    var scrollTicking = false;
    window.addEventListener('scroll', function() {
        if (!scrollTicking) {
            requestAnimationFrame(function() {
                updateNavbar();
                updateActiveNavLink();
                updateBackToTop();
                scrollTicking = false;
            });
            scrollTicking = true;
        }
    });
    updateNavbar();
    updateActiveNavLink();
    updateBackToTop();

    window.addEventListener('resize', function() {
        if (window.innerWidth > 768 && navLinks.classList.contains('active')) {
            closeMenu();
        }
    });
    hamburger.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            hamburger.click();
        }
    });
})();
