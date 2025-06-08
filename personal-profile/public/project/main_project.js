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

    // Lắng nghe click vào bất kỳ ảnh nào trong .project-media để mở lightbox
    document.body.addEventListener('click', function(e) {
        if (e.target.matches('.project-media img')) {
            const lightbox = document.getElementById('img-lightbox');
            const lightboxImg = document.getElementById('img-lightbox-img');
            if (lightbox && lightboxImg) {
                lightboxImg.src = e.target.src;
                lightbox.style.display = 'flex';
            }
        }
        // Đóng lightbox khi click nền tối
        if (e.target.id === 'img-lightbox') {
            e.target.style.display = 'none';
        }
    });
});
// Hiển thị ảnh minh họa dự án, ẩn bớt nếu quá nhiều, bấm "Xem thêm ảnh"/"Thu gọn" để hiện/tắt tất cả
document.addEventListener('DOMContentLoaded', function () {
    const images = window.projectImages || [];
    const maxShow = 4;
    const container = document.getElementById('project-images');
    const btn = document.getElementById('show-more-images');
    let expanded = false;

    function renderImages(showAll = false) {
        container.innerHTML = images
            .slice(0, showAll ? images.length : maxShow)
            .map(img =>
                `<div class="media-item">
                    <img src="${img.src}" alt="Project Image">
                    <div class="media-caption">${img.caption || ""}</div>
                </div>`
            ).join('');
        if (images.length > maxShow) {
            btn.style.display = '';
            btn.textContent = showAll ? 'Thu gọn ảnh' : 'Xem thêm ảnh';
        } else {
            btn.style.display = 'none';
        }
        expanded = showAll;
    }

    if (btn) btn.onclick = () => renderImages(!expanded);

    renderImages();
});

// Hiển thị video dự án, ẩn bớt nếu quá nhiều, bấm "Xem thêm video"/"Thu gọn" để hiện/tắt tất cả
document.addEventListener('DOMContentLoaded', function () {
    const videos = window.projectVideos || [];
    const container = document.getElementById('project-videos');
    const btn = document.getElementById('show-more-videos');
    const maxShow = 2;
    let expanded = false;

    function getYoutubeId(url) {
        const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/))([\w-]{11})/);
        return match ? match[1] : url;
    }

    function renderVideos(showAll = false) {
        container.innerHTML = videos
            .slice(0, showAll ? videos.length : maxShow)
            .map(v => {
                const id = getYoutubeId(v.url);
                // Nếu có thuộc tính unmuted thì không thêm mute=1
                const isUnmuted = v.unmuted === true || id === "UYW73OcZ8RM";
                return `<div class="media-item">
                    <iframe src="https://www.youtube.com/embed/${id}?autoplay=1&rel=0${isUnmuted ? "" : "&mute=1"}"
                        frameborder="0"
                        allow="autoplay; encrypted-media"
                        allowfullscreen
                        style="width:100%;border-radius:8px;"></iframe>
                    <div class="media-caption">${v.caption || ""}</div>
                </div>`;
            })
            .join('');
        if (videos.length > maxShow) {
            btn.style.display = '';
            btn.textContent = showAll ? 'Thu gọn video' : 'Xem thêm video';
        } else {
            btn.style.display = 'none';
        }
        expanded = showAll;
    }

    if (btn) btn.onclick = () => renderVideos(!expanded);
    renderVideos();
});

// Đổi màu nền động khi cuộn trang (giống main.js)
document.addEventListener('DOMContentLoaded', () => {
    // Các bộ màu chuyển đổi
    const colorSets = [
        ['#ffb347', '#ff5e62', '#8fd3f4', '#ffcc33', '#ff9966', '#b2ff59', '#40c4ff', '#ff80ab'],
        ['#a18cd1', '#fbc2eb', '#fad0c4', '#ffd6e0', '#fcb69f', '#b2ff59', '#40c4ff', '#ff80ab'],
        ['#43cea2', '#185a9d', '#ffaf7b', '#d76d77', '#3a1c71', '#b2ff59', '#40c4ff', '#ff80ab']
    ];

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
        const overlay = document.querySelector('.gradient-bg-overlay');
        if (overlay) overlay.style.background = grad;

        for (let i = 0; i < 8; i++) {
            const color = lerpColor(colorSets[idx][i], colorSets[nextIdx][i], localT);
            const bubble = document.querySelector('.g' + (i + 1));
            if (bubble) bubble.style.background = color;
        }
    });

    // Gọi 1 lần khi load trang để set màu nền đúng vị trí cuộn
    window.dispatchEvent(new Event('scroll'));
});