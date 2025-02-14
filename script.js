document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('background-canvas');
    const ctx = canvas.getContext('2d');
    const sections = document.querySelectorAll('section');
    const homeSection = document.getElementById('home');
    const aboutSection = document.getElementById('about');
    const projectsSection = document.getElementById('projects');
    const contactSection = document.getElementById('contact');
    const sectionsArray = [homeSection, aboutSection, projectsSection, contactSection];

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const stars = [];
    const smallRedStars = [];
    const starCount = 200;
    const smallRedStarCount = 200;
    const mainPoints = [];
    const backgroundPoints = [];
    const mainPointCount = 175; // Controls how many points are shown to make the polygons //
    const backgroundPointCount = 150; // Controls how many polygons are floating in the background // 
    const maxDistance = 150;
    const polygonLifetime = 2000; // 3 seconds for the polygon to stay visible
    let mouse = { x: canvas.width / 2, y: canvas.height / 2 };
    let isStarryBackground = false;
    let isInteractive = true;
    let isScrolling = false;
    let lastMouseMoveTime = 0;
    let mouseMoved = false;

    function createPoints() {
        mainPoints.length = 0;
        backgroundPoints.length = 0;
        for (let i = 0; i < mainPointCount; i++) {
            mainPoints.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5
            });
        }

        for (let i = 0; i < backgroundPointCount; i++) {
            backgroundPoints.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 0.2,
                vy: (Math.random() - 0.5) * 0.2
            });
        }
    }

    function createStars() {
        stars.length = 0;
        for (let i = 0; i < starCount; i++) {
            stars.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                radius: Math.random() * 1.5 + 0.5,
                vx: (Math.random() - 0.5) * 0.1,
                vy: (Math.random() - 0.5) * 0.1
            });
        }

        smallRedStars.length = 0;
        for (let i = 0; i < smallRedStarCount; i++) {
            smallRedStars.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                radius: Math.random() * 0.5 + 0.2,
                vx: 0,
                vy: 0
            });
        }
    }

    function drawStars() {
        stars.forEach(star => {
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(169, 169, 169, 0.8)';
            ctx.shadowBlur = 5;
            ctx.shadowColor = 'grey';
            ctx.fill();
        });
    }

    function drawSmallRedStars() {
        smallRedStars.forEach(star => {
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255, 0, 0, 0.8)';
            ctx.shadowBlur = 5;
            ctx.shadowColor = 'red';
            ctx.fill();
        });
    }

    function drawPoints(points, isBackground = false) {
        const currentTime = Date.now();
        const timeSinceLastMouseMove = currentTime - lastMouseMoveTime;
        const shouldDrawPolygons = mouseMoved || timeSinceLastMouseMove < polygonLifetime;

        points.forEach(point => {
            ctx.beginPath();
            ctx.arc(point.x, point.y, isBackground ? 1.5 : 2, 0, Math.PI * 2);
            ctx.fillStyle = isBackground ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.8)';
            ctx.fill();

            if (shouldDrawPolygons) {
                points.forEach(otherPoint => {
                    const dx = point.x - otherPoint.x;
                    const dy = point.y - otherPoint.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < maxDistance) {
                        ctx.beginPath();
                        ctx.moveTo(point.x, point.y);
                        ctx.lineTo(otherPoint.x, otherPoint.y);

                        const mouseDx = mouse.x - point.x;
                        const mouseDy = mouse.y - point.y;
                        const mouseDistance = Math.sqrt(mouseDx * mouseDx + mouseDy * mouseDy);

                        let opacity;
                        if (mouseMoved) {
                            opacity = 0.2 + (1 - mouseDistance / maxDistance) * 0.8;
                        } else {
                            // Calculate fading effect
                            const fadeProgress = timeSinceLastMouseMove / polygonLifetime;
                            opacity = (0.2 + (1 - mouseDistance / maxDistance) * 0.8) * (1 - fadeProgress);
                        }

                        ctx.lineWidth = isBackground ? 0.3 : 1 + (maxDistance - distance) / 50;
                        ctx.strokeStyle = isBackground ? 'rgba(255, 0, 0, 0.2)' : `rgba(255, 0, 0, ${opacity})`;
                        ctx.stroke();
                    }
                });
            }
        });

        if (!mouseMoved && timeSinceLastMouseMove >= polygonLifetime) {
            mouseMoved = false; // Reset flag after polygons have fully faded
        }
    }

    function updatePoints(points) {
        points.forEach(point => {
            point.x += point.vx;
            point.y += point.vy;

            if (point.x < 0 || point.x > canvas.width) point.vx *= -1;
            if (point.y < 0 || point.y > canvas.height) point.vy *= -1;
        });
    }

    function updateStars() {
        stars.forEach(star => {
            star.x += star.vx;
            star.y += star.vy;

            if (star.x < 0 || star.x > canvas.width) star.vx *= -1;
            if (star.y < 0 || star.y > canvas.height) star.vy *= -1;
        });
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (isInteractive) {
            drawPoints(mainPoints);
            drawPoints(backgroundPoints, true);
            updatePoints(mainPoints);
            updatePoints(backgroundPoints);
        } else if (isStarryBackground) {
            drawStars();
            drawSmallRedStars();
            updateStars();
        }

        requestAnimationFrame(animate);
    }

    window.addEventListener('mousemove', (e) => {
        if (isInteractive) {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
            lastMouseMoveTime = Date.now();
            mouseMoved = true; // Set flag to true when mouse moves
        }
    });

    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        if (isInteractive) {
            createPoints();
        } else if (isStarryBackground) {
            createStars();
        }
    });

    document.querySelector('.cta-button').addEventListener('click', (e) => {
        e.preventDefault();
        document.getElementById('about').scrollIntoView({ behavior: 'smooth' });
    });

    window.addEventListener('wheel', (e) => {
        if (isScrolling) return;

        isScrolling = true;
        const scrollDirection = e.deltaY > 0 ? 'down' : 'up';
        const currentSectionIndex = sectionsArray.findIndex(section => section.getBoundingClientRect().top >= -10 && section.getBoundingClientRect().top <= 10);
        let targetSection;

        if (scrollDirection === 'down') {
            targetSection = sectionsArray[Math.min(currentSectionIndex + 1, sectionsArray.length - 1)];
        } else {
            targetSection = sectionsArray[Math.max(currentSectionIndex - 1, 0)];
        }

        if (targetSection) {
            targetSection.scrollIntoView({ behavior: 'smooth' });
        }

        setTimeout(() => {
            isScrolling = false;
        }, 1000);
    });

    createPoints();
    createStars();
    animate();
});

// New Sidebar Scroll Logic (Integrating with Your Current Setup)
document.addEventListener('DOMContentLoaded', () => {
    const sidebar = document.querySelector('.sidebar');
    const aboutSection = document.getElementById('about');
    let lastScrollTop = 0;

    window.addEventListener('scroll', () => {
        const aboutSectionTop = aboutSection.getBoundingClientRect().top;
        const aboutSectionBottom = aboutSection.getBoundingClientRect().bottom;
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        if (aboutSectionTop <= 0 && aboutSectionBottom >= window.innerHeight / 2) {
            sidebar.classList.add('sidebar-visible');
            sidebar.classList.remove('sidebar-hidden');
        } else if (scrollTop < lastScrollTop) {
            sidebar.classList.remove('sidebar-visible');
            sidebar.classList.add('sidebar-hidden');
        } else {
            sidebar.classList.remove('sidebar-visible');
            sidebar.classList.add('sidebar-hidden');
        }

        lastScrollTop = scrollTop;
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const footer = document.querySelector('.footer');
    const contactSection = document.getElementById('contact');

    window.addEventListener('scroll', () => {
        const contactSectionTop = contactSection.getBoundingClientRect().top;
        const contactSectionBottom = contactSection.getBoundingClientRect().bottom;

        if (contactSectionTop <= window.innerHeight && contactSectionBottom >= 0) {
            footer.style.display = 'block';
        } else {
            footer.style.display = 'none';
        }
    });
});

// Smooth scrolling for sidebar links
document.querySelectorAll('.sidebar a').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});
