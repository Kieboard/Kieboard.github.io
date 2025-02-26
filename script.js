document.addEventListener('DOMContentLoaded', function () {
    const categoryIcons = document.querySelectorAll('.category-icon');
    const projectSections = document.querySelectorAll('.project-category');
    let activeSection = null; 

    // Hide only project sections initially, not icons
    projectSections.forEach(section => section.style.display = 'none');

    categoryIcons.forEach(icon => {
        icon.addEventListener('click', function () {
            const targetId = this.dataset.target;
            const targetSection = document.getElementById(targetId);

            if (activeSection === targetSection) {
                // Toggle off if the same section is clicked again
                targetSection.style.display = 'none';
                activeSection = null;
            } else {
                // Hide all sections and show the clicked section
                projectSections.forEach(section => section.style.display = 'none');
                targetSection.style.display = 'block';
                activeSection = targetSection;
            }
        });
    });
});

document.addEventListener("DOMContentLoaded", function () {
    // Dynamically update copyright year
    document.getElementById('year').textContent = new Date().getFullYear();

    // Initialize Swiper (might be needed idk)
    new Swiper(".card-swiper", {
        centeredSlides: false,
        spaceBetween: 0,
        slidesPerView: 'auto'
    });
});




































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
const polygons = [];
    const starCount = 100;
    const smallRedStarCount = 100;
    const mainPointCount = 175;
    const backgroundPointCount = 150;

    const maxDistance = 125;
    const polygonLifetime = 3000; // 3 seconds
    let mouse = { x: canvas.width / 2, y: canvas.height / 2 };

    let isStarryBackground = false;
    let isInteractive = true;
    let isScrolling = false;
    let lastMouseMoveTime = 0;
    let mouseMoved = false;
    const polygonCount = 100;
    const ignoredElements = document.querySelectorAll(
        '.text-content, .image, .send-message-box, .footer, .sidebar, .header'
    );
    function isInsideIgnoredElement(x, y) {
        return Array.from(ignoredElements).some(element => {
            const rect = element.getBoundingClientRect();
            const scrollX = window.scrollX || document.documentElement.scrollLeft;
            const scrollY = window.scrollY || document.documentElement.scrollTop;
            return x > rect.left + scrollX && x < rect.right + scrollX &&
                   y > rect.top + scrollY && y < rect.bottom + scrollY;
        });
    }

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

    // Add drawing and updating of polygons to the animation loop
    drawPolygons();
    updatePolygons();

    requestAnimationFrame(animate);
}

    function createPolygons() {
        polygons.length = 0;

        for (let i = 0; i < polygonCount; i++) {
            let x, y;
            do {
                x = Math.random() * canvas.width;
                y = Math.random() * canvas.height;
            } while (isInsideIgnoredElement(x, y));

            polygons.push({ x, y, vx: (Math.random() - 0.5) * 0.4, vy: (Math.random() - 0.5) * 0.4 });
        }
    }

    function updatePolygons() {
        polygons.forEach(polygon => {
            let newX = polygon.x + polygon.vx;
            let newY = polygon.y + polygon.vy;

            if (!isInsideIgnoredElement(newX, newY)) {
                polygon.x = newX;
                polygon.y = newY;
            } else {
                polygon.vx *= -1;
                polygon.vy *= -1;
            }
        });
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
    function drawPolygons() {
        polygons.forEach(polygon => {
            // Draw the individual polygon point
            ctx.beginPath();
            ctx.arc(polygon.x, polygon.y, 2, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
            ctx.fill();
    
            polygons.forEach(other => {
                const dx = polygon.x - other.x;
                const dy = polygon.y - other.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
    
                // If the distance between the points is less than the maxDistance, draw a line
                if (distance < maxDistance) {
                    ctx.beginPath();
                    ctx.moveTo(polygon.x, polygon.y);
                    ctx.lineTo(other.x, other.y);
    
                    // Calculate opacity based on the distance between the points
                    const opacity = 1 - distance / maxDistance;
                    ctx.strokeStyle = `rgba(255, 0, 0, ${opacity})`;
    
                    // Calculate line width based on distance
                    ctx.lineWidth = 1 + (maxDistance - distance) / 50;
    
                    ctx.stroke();
                }
            });
        });
    }
    


    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        createPoints();
        createStars();
        drawPolygons()
        updatePolygons();
    });

    document.querySelector('.cta-button').addEventListener('click', (e) => {
        e.preventDefault();
        document.getElementById('about').scrollIntoView({ behavior: 'smooth' });
    });
 
    
    /*** 🚀 Initialize Everything ***/
    createPoints();
    createStars();
    createPolygons();
    animate();
});