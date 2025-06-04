// This file contains the JavaScript code for the personal profile application.
// It handles dynamic behavior on the profile page, such as event listeners and data manipulation.

document.addEventListener('DOMContentLoaded', () => {
    const profileButton = document.getElementById('profile-button');
    const profileInfo = document.getElementById('profile-info');

    profileButton.addEventListener('click', () => {
        profileInfo.classList.toggle('hidden');
    });
});

// Bubble di chuyển theo chuột
document.addEventListener('DOMContentLoaded', () => {
    // Bubble interactive
    const interBubble = document.querySelector('.interactive');
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

    // Hàm blend màu
    function lerpColor(a, b, t) {
        let ah = parseInt(a.replace('#', ''), 16),
            bh = parseInt(b.replace('#', ''), 16),
            ar = ah >> 16, ag = (ah >> 8) & 0xff, ab = ah & 0xff,
            br = bh >> 16, bg = (bh >> 8) & 0xff, bb = bh & 0xff,
            rr = ar + t * (br - ar),
            rg = ag + t * (bg - ag),
            rb = ab + t * (bb - ab);
        return '#' + (((1 << 24) + (rr << 16) + (rg << 8) + (rb | 0)).toString(16).slice(1));
    }

    // Các bộ màu chuyển đổi
    const colorSets = [
        ['#ffb347', '#ff5e62', '#8fd3f4', '#ffcc33', '#ff9966', '#b2ff59', '#40c4ff', '#ff80ab'],
        ['#a18cd1', '#fbc2eb', '#fad0c4', '#ffd6e0', '#fcb69f', '#b2ff59', '#40c4ff', '#ff80ab'],
        ['#43cea2', '#185a9d', '#ffaf7b', '#d76d77', '#3a1c71', '#b2ff59', '#40c4ff', '#ff80ab']
    ];

    // Đổi màu bubble khi cuộn trang
    // Tính màu trung bình của các bóng
    function hexToRgb(hex) {
        hex = hex.replace('#', '');
        if (hex.length === 3) hex = hex.split('').map(x => x + x).join('');
        const num = parseInt(hex, 16);
        return [num >> 16, (num >> 8) & 0xff, num & 0xff];
    }
    function rgbToHex([r, g, b]) {
        return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
    }

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        const docHeight = document.body.scrollHeight - window.innerHeight;
        const t = docHeight === 0 ? 0 : scrollY / docHeight;

        const idx = Math.floor(t * (colorSets.length - 1));
        const nextIdx = Math.min(idx + 1, colorSets.length - 1);
        const localT = (t * (colorSets.length - 1)) % 1;

        // Lấy màu các bóng
        let colors = [];
        for (let i = 0; i < 8; i++) {
            const color = lerpColor(colorSets[idx][i], colorSets[nextIdx][i], localT);
            colors.push(hexToRgb(color));
        }
        // Tính màu trung bình
        let avg = colors.reduce((a, b) => [a[0]+b[0], a[1]+b[1], a[2]+b[2]], [0,0,0])
            .map(x => Math.round(x / colors.length));
        // Tạo gradient từ màu đầu, giữa, cuối
        const grad = `linear-gradient(120deg, ${rgbToHex(colors[0])}, ${rgbToHex(avg)}, ${rgbToHex(colors[colors.length-1])})`;
        document.querySelector('.gradient-bg-overlay').style.background = grad;

        for (let i = 0; i < 8; i++) {
            const color = lerpColor(colorSets[idx][i], colorSets[nextIdx][i], localT);
            const bubble = document.querySelector('.g' + (i + 1));
            if (bubble) bubble.style.background = color;
        }
    });
});

// Animation cho các bóng bay
document.addEventListener('DOMContentLoaded', () => {
    const bubbles = Array.from(document.querySelectorAll('.g1, .g2, .g3, .g4, .g5, .g6'));
    // Đảm bảo layout đã render
    setTimeout(() => {
        bubbles.forEach(b => {
            // Lấy lại kích thước thực tế
            b.size = b.offsetWidth;
            // Đặt vị trí ngẫu nhiên nhưng không cho bóng vượt ra ngoài màn hình
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
                if (b.x < 0) {
                    b.x = 0;
                    b.vx *= -1;
                }
                if (b.x > vw - b.size) {
                    b.x = vw - b.size;
                    b.vx *= -1;
                }
                if (b.y < 0) {
                    b.y = 0;
                    b.vy *= -1;
                }
                if (b.y > vh - b.size) {
                    b.y = vh - b.size;
                    b.vy *= -1;
                }
                b.el.style.transform = `translate(${b.x}px, ${b.y}px)`;
            });
            requestAnimationFrame(animateBubbles);
        }

        animateBubbles();
    }, 0); // Đợi 1 tick để layout xong
});

document.addEventListener('DOMContentLoaded', () => {
    window.dispatchEvent(new Event('scroll'));
});

document.addEventListener('DOMContentLoaded', () => {
    const interBubble = document.querySelector('.interactive');
    if (interBubble && !interBubble.querySelector('.bubble-ripple')) {
        for (let i = 0; i < 3; i++) {
            const ripple = document.createElement('div');
            ripple.className = 'bubble-ripple' + (i === 1 ? ' r2' : i === 2 ? ' r3' : '');
            interBubble.appendChild(ripple);
        }
    }
});