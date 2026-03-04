/* ============================================================
   KIEBOARD PORTFOLIO — script.js
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

    /* ========================== */
    /* Footer Year                */
    /* ========================== */
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();


    /* ========================== */
    /* Hamburger Toggle           */
    /* ========================== */
    const hamburger = document.getElementById('hamburger');
    const navbar    = document.getElementById('navbar');

    if (hamburger && navbar) {
        hamburger.addEventListener('click', () => {
            const isOpen = navbar.classList.toggle('visible');
            hamburger.classList.toggle('open', isOpen);
        });

        // Close navbar when a link is clicked
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navbar.classList.remove('visible');
                hamburger.classList.remove('open');
            });
        });

        // Close on click outside
        document.addEventListener('click', (e) => {
            if (!navbar.contains(e.target) && !hamburger.contains(e.target)) {
                navbar.classList.remove('visible');
                hamburger.classList.remove('open');
            }
        });
    }


    /* ========================== */
    /* Active nav link on scroll  */
    /* ========================== */
    const sections    = document.querySelectorAll('section[id]');
    const allNavLinks = document.querySelectorAll('.nav-link');

    function setActiveNav() {
        const scrollPos = window.scrollY + 100;
        sections.forEach(section => {
            const top    = section.offsetTop;
            const height = section.offsetHeight;
            if (scrollPos >= top && scrollPos < top + height) {
                allNavLinks.forEach(l => l.classList.remove('active'));
                const active = document.querySelector(`.nav-link[href="#${section.id}"]`);
                if (active) active.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', setActiveNav, { passive: true });
    setActiveNav();


    /* ========================== */
    /* Smooth scroll for ALL CTAs */
    /* ========================== */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });


    /* ========================== */
    /* Swiper — Cert Slider       */
    /* ========================== */
    new Swiper('.cert-swiper', {
        loop: true,
        slidesPerView: 1,
        spaceBetween: 0,
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        autoplay: {
            delay: 4000,
            disableOnInteraction: true,
        },
    });


    /* ========================== */
    /* Project Tab Switcher       */
    /* ========================== */
    const tabBtns   = document.querySelectorAll('.tab-btn');
    const panels    = document.querySelectorAll('.project-panel');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.dataset.target;

            tabBtns.forEach(b => b.classList.remove('active'));
            panels.forEach(p => p.classList.remove('active'));

            btn.classList.add('active');
            const target = document.getElementById(targetId);
            if (target) target.classList.add('active');
        });
    });


    /* ========================== */
    /* Contact Form Submission    */
    /* ========================== */
    const contactForm = document.getElementById('contact-form');
    const submitBtn   = document.getElementById('submit-btn');
    const feedback    = document.getElementById('form-feedback');

    if (contactForm && submitBtn && feedback) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            submitBtn.disabled = true;
            submitBtn.querySelector('span').textContent = 'Sending...';
            submitBtn.querySelector('i').className = 'fa-solid fa-spinner fa-spin';
            feedback.className = 'form-feedback';
            feedback.textContent = '';

            try {
                const res = await fetch(contactForm.action, {
                    method: 'POST',
                    body: new FormData(contactForm),
                    headers: { 'Accept': 'application/json' }
                });
                if (res.ok) {
                    feedback.className = 'form-feedback success';
                    feedback.innerHTML = '<i class="fa-solid fa-circle-check"></i> Message sent! I\'ll get back to you soon.';
                    contactForm.reset();
                } else {
                    throw new Error('Server error');
                }
            } catch {
                feedback.className = 'form-feedback error';
                feedback.innerHTML = '<i class="fa-solid fa-circle-xmark"></i> Something went wrong. Try emailing me directly.';
            } finally {
                submitBtn.disabled = false;
                submitBtn.querySelector('span').textContent = 'Send Message';
                submitBtn.querySelector('i').className = 'fa-solid fa-paper-plane';
            }
        });
    }


    /* ========================== */
    /* Scroll Snapping            */
    /* ========================== */
    const snapSections = Array.from(document.querySelectorAll('section[id]'));
    let isSnapping = false;
    let touchStartY = 0;

    function snapToSection(index) {
        if (index < 0 || index >= snapSections.length) return;
        isSnapping = true;
        snapSections[index].scrollIntoView({ behavior: 'smooth' });
        setTimeout(() => { isSnapping = false; }, 800);
    }

    function getCurrentIndex() {
        const mid = window.scrollY + window.innerHeight / 2;
        let closest = 0;
        let closestDist = Infinity;
        snapSections.forEach((sec, i) => {
            const dist = Math.abs(sec.offsetTop + sec.offsetHeight / 2 - mid);
            if (dist < closestDist) { closestDist = dist; closest = i; }
        });
        return closest;
    }

    window.addEventListener('wheel', (e) => {
        if (isSnapping) { e.preventDefault(); return; }
        e.preventDefault();
        const dir = e.deltaY > 0 ? 1 : -1;
        snapToSection(getCurrentIndex() + dir);
    }, { passive: false });

    window.addEventListener('touchstart', (e) => {
        touchStartY = e.touches[0].clientY;
    }, { passive: true });

    window.addEventListener('touchend', (e) => {
        if (isSnapping) return;
        const diff = touchStartY - e.changedTouches[0].clientY;
        if (Math.abs(diff) < 30) return;
        const dir = diff > 0 ? 1 : -1;
        snapToSection(getCurrentIndex() + dir);
    }, { passive: true });


    const animEls = document.querySelectorAll('[data-animate]');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });

    animEls.forEach(el => observer.observe(el));


    /* ========================== */
    /* Canvas Background          */
    /* ========================== */
    const canvas = document.getElementById('background-canvas');
    if (canvas && window.innerWidth >= 600) {

    const ctx = canvas.getContext('2d');

    function resizeCanvas() {
        canvas.width  = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas, { passive: true });

    // --- Config ---
    const POINT_COUNT  = 80;
    const BG_COUNT     = 60;
    const MAX_DIST     = 160;
    const FADE_TIME    = 3000;

    // --- State ---
    let mouse = { x: canvas.width / 2, y: canvas.height / 2 };
    let lastMove = 0;
    let mouseMoved = false;

    // --- Points ---
    function makePoint(slow = false) {
        return {
            x:  Math.random() * canvas.width,
            y:  Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * (slow ? 0.2 : 0.5),
            vy: (Math.random() - 0.5) * (slow ? 0.2 : 0.5),
        };
    }

    let points   = Array.from({ length: POINT_COUNT }, () => makePoint(false));
    let bgPoints = Array.from({ length: BG_COUNT },    () => makePoint(true));

    function rebuildPoints() {
        points   = Array.from({ length: POINT_COUNT }, () => makePoint(false));
        bgPoints = Array.from({ length: BG_COUNT },    () => makePoint(true));
    }

    window.addEventListener('resize', rebuildPoints, { passive: true });

    // --- Mouse ---
    window.addEventListener('mousemove', (e) => {
        mouse.x   = e.clientX;
        mouse.y   = e.clientY;
        lastMove  = Date.now();
        mouseMoved = true;
    }, { passive: true });

    // --- Update ---
    function updatePoints(pts) {
        pts.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            if (p.x < 0 || p.x > canvas.width)  p.vx *= -1;
            if (p.y < 0 || p.y > canvas.height)  p.vy *= -1;
        });
    }

    // --- Draw ---
    function drawPoints(pts, isBg) {
        const now          = Date.now();
        const timeSince    = now - lastMove;
        const shouldLines  = mouseMoved || timeSince < FADE_TIME;
        const fadeRatio    = mouseMoved ? 1 : Math.max(0, 1 - timeSince / FADE_TIME);

        pts.forEach(p => {
            // Dot
            ctx.beginPath();
            ctx.arc(p.x, p.y, isBg ? 1 : 1.5, 0, Math.PI * 2);
            ctx.fillStyle = isBg ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.7)';
            ctx.fill();

            if (!shouldLines) return;

            pts.forEach(o => {
                if (o === p) return;
                const dx   = p.x - o.x;
                const dy   = p.y - o.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist >= MAX_DIST) return;

                // Opacity based on proximity of points to each other (not mouse distance)
                // Mouse adds a boost effect when nearby
                const baseOpacity = (1 - dist / MAX_DIST) * (isBg ? 0.25 : 0.5);

                const mdx   = mouse.x - p.x;
                const mdy   = mouse.y - p.y;
                const mDist = Math.sqrt(mdx * mdx + mdy * mdy);
                const mouseBoost = Math.max(0, 1 - mDist / 300) * 0.4;

                const opacity = (baseOpacity + mouseBoost) * fadeRatio;
                if (opacity <= 0.01) return;

                ctx.beginPath();
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(o.x, o.y);
                ctx.lineWidth   = isBg ? 0.3 : 0.6 + (1 - dist / MAX_DIST) * 0.6;
                ctx.strokeStyle = `rgba(255,0,0,${opacity})`;
                ctx.stroke();
            });
        });

        if (!mouseMoved && timeSince >= FADE_TIME) mouseMoved = false;
    }

    // --- Animation Loop ---
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        drawPoints(bgPoints, true);
        drawPoints(points,   false);
        updatePoints(points);
        updatePoints(bgPoints);

        requestAnimationFrame(animate);
    }

    animate();

    } // end canvas block

});