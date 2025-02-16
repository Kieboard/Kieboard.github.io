document.addEventListener('DOMContentLoaded', () => {
    /*** 🎨 Canvas Setup ***/
    const canvas = document.getElementById('background-canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    /*** 📌 Sections for Smooth Scrolling ***/
    const sectionsArray = [
        document.getElementById('home'),
        document.getElementById('about'),
        document.getElementById('projects'),
        document.getElementById('contact')
    ];

    /*** ✨ Animation Settings ***/
    const stars = [];
    const smallRedStars = [];
    const mainPoints = [];
    const backgroundPoints = [];

    const starCount = 200;
    const smallRedStarCount = 200;
    const mainPointCount = 175;
    const backgroundPointCount = 150;

    const maxDistance = 150;
    const polygonLifetime = 3000; // 3 seconds
    let mouse = { x: canvas.width / 2, y: canvas.height / 2 };

    let isStarryBackground = false;
    let isInteractive = true;
    let isScrolling = false;
    let lastMouseMoveTime = 0;
    let mouseMoved = false;

    /*** 🎭 Create Points for Polygons ***/
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

    /*** ⭐ Create Stars ***/
    function createStars() {
        stars.length = 0;
        smallRedStars.length = 0;

        for (let i = 0; i < starCount; i++) {
            stars.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                radius: Math.random() * 1.5 + 0.5,
                vx: (Math.random() - 0.5) * 0.1,
                vy: (Math.random() - 0.5) * 0.1
            });
        }

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

    /*** 🎨 Draw Stars & Points ***/
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

                        let opacity = (1 - mouseDistance / maxDistance) * 0.8;
                        if (!mouseMoved) {
                            const fadeProgress = timeSinceLastMouseMove / polygonLifetime;
                            opacity *= (1 - fadeProgress);
                        }

                        ctx.lineWidth = isBackground ? 0.3 : 1 + (maxDistance - distance) / 50;
                        ctx.strokeStyle = `rgba(255, 0, 0, ${opacity})`;
                        ctx.stroke();
                    }
                });
            }
        });

        if (!mouseMoved && timeSinceLastMouseMove >= polygonLifetime) {
            mouseMoved = false;
        }
    }

    /*** 🔄 Update Positions ***/
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

    /*** 🎞️ Animation Loop ***/
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (isInteractive) {
            drawPoints(backgroundPoints, true);
            drawPoints(mainPoints);
            updatePoints(mainPoints);
            updatePoints(backgroundPoints);
        } else if (isStarryBackground) {
            drawStars();
            drawSmallRedStars();
            updateStars();
        }

        requestAnimationFrame(animate);
    }

    /*** 🎯 Event Listeners ***/
    window.addEventListener('mousemove', (e) => {
        if (isInteractive) {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
            lastMouseMoveTime = Date.now();
            mouseMoved = true;
        }
    });

    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        createPoints();
        createStars();
    });

    document.querySelector('.cta-button').addEventListener('click', (e) => {
        e.preventDefault();
        document.getElementById('about').scrollIntoView({ behavior: 'smooth' });
    });

    /*** 🚀 Initialize Everything ***/
    createPoints();
    createStars();
    animate();
});
