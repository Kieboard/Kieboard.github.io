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
    const ignoredElements = document.querySelectorAll(
        '.text-content, .image, .send-message-box, .footer, .sidebar, .header'
    );

    const stars = [];
    const polygons = [];

    const starCount = 200;
    const polygonCount = 175;
    const maxDistance = 120;
    let mouse = { x: canvas.width / 2, y: canvas.height / 2 };

    /*** 🎭 Helper Function to Check Overlap ***/
    function isInsideIgnoredElement(x, y) {
        return Array.from(ignoredElements).some(element => {
            const rect = element.getBoundingClientRect();
            const scrollX = window.scrollX || document.documentElement.scrollLeft;
            const scrollY = window.scrollY || document.documentElement.scrollTop;
            return x > rect.left + scrollX && x < rect.right + scrollX &&
                   y > rect.top + scrollY && y < rect.bottom + scrollY;
        });
    }

    /*** ⭐ Create Stars ***/
    function createStars() {
        stars.length = 0;

        for (let i = 0; i < starCount; i++) {
            let x, y;
            do {
                x = Math.random() * canvas.width;
                y = Math.random() * canvas.height;
            } while (isInsideIgnoredElement(x, y));

            stars.push({ x, y, radius: Math.random() * 1.5 + 0.5 });
        }
    }

    /*** 🔺 Create Polygons ***/
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

    /*** 🎨 Draw Stars ***/
    function drawStars() {
        stars.forEach(star => {
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
            ctx.fill();
        });
    }

    /*** 🔺 Draw Polygons ***/
    function drawPolygons() {
        polygons.forEach(polygon => {
            ctx.beginPath();
            ctx.arc(polygon.x, polygon.y, 2, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255, 0, 0, 0.6)';
            ctx.fill();

            polygons.forEach(other => {
                const dx = polygon.x - other.x;
                const dy = polygon.y - other.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < maxDistance) {
                    ctx.beginPath();
                    ctx.moveTo(polygon.x, polygon.y);
                    ctx.lineTo(other.x, other.y);
                    ctx.strokeStyle = `rgba(255, 0, 0, ${1 - distance / maxDistance})`;
                    ctx.stroke();
                }
            });
        });
    }

    /*** 🔄 Update Positions & Prevent Overlaps ***/
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

    /*** 🎞️ Animation Loop ***/
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawStars();
        drawPolygons();
        updatePolygons();
        requestAnimationFrame(animate);
    }

    /*** 🚀 Initialize Everything ***/
    createStars();
    createPolygons();
    animate();

    /*** 🔄 Resize Handling ***/
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        createStars();
        createPolygons();
    });
});
