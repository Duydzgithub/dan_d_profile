document.addEventListener('DOMContentLoaded', () => {
    // Bubble di chuyển theo chuột
    const interBubble = document.querySelector('.interactive');
    if (interBubble) {
        let curX = 0, curY = 0, tgX = 0, tgY = 0;
        function move() {
            const rect = interBubble.getBoundingClientRect();
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            curX += (tgX - curX) / 20;
            curY += (tgY - curY) / 20;
            interBubble.style.transform = `translate(${Math.round(curX - centerX)}px, ${Math.round(curY - centerY)}px)`;
            requestAnimationFrame(move);
        }
        window.addEventListener('mousemove', (e) => {
            tgX = e.clientX;
            tgY = e.clientY;
        });
        move();

        // Tạo hiệu ứng sóng nước
        if (!interBubble.querySelector('.bubble-ripple')) {
            for (let i = 0; i < 3; i++) {
                const ripple = document.createElement('div');
                ripple.className = 'bubble-ripple' + (i === 1 ? ' r2' : i === 2 ? ' r3' : '');
                interBubble.appendChild(ripple);
            }
        }
    }

    // Các bóng nền động
    const bubbles = Array.from(document.querySelectorAll('.g1, .g2, .g3, .g4, .g5'));
    setTimeout(() => {
        bubbles.forEach(b => {
            b.size = b.offsetWidth;
            b.x = Math.random() * (window.innerWidth - b.size);
            b.y = Math.random() * (window.innerHeight - b.size);
            b.vx = (Math.random() - 0.5) * 2;
            b.vy = (Math.random() - 0.5) * 2;
            b.el = b;
        });

        function animateBubbles() {
            const vw = window.innerWidth, vh = window.innerHeight;
            bubbles.forEach(b => {
                b.x += b.vx;
                b.y += b.vy;
                if (b.x < 0) { b.x = 0; b.vx *= -1; }
                if (b.x > vw - b.size) { b.x = vw - b.size; b.vx *= -1; }
                if (b.y < 0) { b.y = 0; b.vy *= -1; }
                if (b.y > vh - b.size) { b.y = vh - b.size; b.vy *= -1; }
                b.el.style.transform = `translate(${b.x}px, ${b.y}px)`;
            });
            requestAnimationFrame(animateBubbles);
        }
        animateBubbles();
    }, 0);
});