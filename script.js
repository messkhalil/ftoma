const canvas = document.getElementById('heartCanvas');
const ctx = canvas.getContext('2d');
const input = document.getElementById('answerInput');
const catOverlay = document.getElementById('catInterface');
const heartBtn = document.getElementById('heartBtn');
const nameContainer = document.getElementById('nameContainer');

let particles = [];
let hue = 0;
let isHeartFormed = false; // هل يبدأ برسم القلب؟

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

class Particle {
    constructor() {
        this.reset();
    }

    reset() {
        // تبدأ الجزيئات في أماكن عشوائية (تأثير النانو المشتت)
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.destX = this.x; 
        this.destY = this.y;
        this.size = Math.random() * 2 + 1;
        this.speed = Math.random() * 0.05 + 0.02;
        this.colorHue = Math.random() * 360;
    }

    update() {
        // تحريك الجزيئات نحو أهدافها (شكل القلب)
        this.x += (this.destX - this.x) * this.speed;
        this.y += (this.destY - this.y) * this.speed;
        this.colorHue += 1;
    }

    draw() {
        ctx.fillStyle = `hsl(${this.colorHue}, 100%, 50%)`; // تأثير RGB
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

// إنشاء الجزيئات
function initParticles() {
    particles = [];
    for (let i = 0; i < 600; i++) {
        particles.push(new Particle());
    }
}

// حساب نقاط شكل القلب
function setHeartShape() {
    let index = 0;
    for (let t = 0; t < Math.PI * 2; t += (Math.PI * 2) / 600) {
        if (index >= particles.length) break;
        
        let x = 16 * Math.pow(Math.sin(t), 3);
        let y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
        
        particles[index].destX = x * 18 + canvas.width / 2;
        particles[index].destY = y * 18 + canvas.height / 2;
        index++;
    }
}

function animate() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)'; // أثر خلفي بسيط
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    particles.forEach(p => {
        p.update();
        p.draw();
    });
    requestAnimationFrame(animate);
}

// 1. عند كتابة "yes"
input.addEventListener('input', (e) => {
    if (e.target.value.toLowerCase() === 'yes') {
        catOverlay.style.display = 'none';
        heartBtn.classList.remove('hidden');
        spawnBoxes();
    }
});

// 2. عند الضغط على زر القلب
heartBtn.addEventListener('click', () => {
    isHeartFormed = true;
    setHeartShape(); // أمر الجزيئات بتشكيل القلب
    nameContainer.style.opacity = '1'; // إظهار اسم فاطمة RGB
    
    // إطلاق القلوب الصغيرة
    for (let i = 0; i < 30; i++) {
        createMiniHeart();
    }
});

function spawnBoxes() {
    setInterval(() => {
        if (isHeartFormed) return; // توقف عند بدء انميشن القلب
        const box = document.createElement('div');
        box.className = 'box';
        box.style.left = Math.random() * 100 + 'vw';
        box.style.borderColor = `hsl(${Math.random() * 360}, 100%, 50%)`;
        document.body.appendChild(box);
        setTimeout(() => box.remove(), 3000);
    }, 300);
}

function createMiniHeart() {
    const mh = document.createElement('div');
    mh.className = 'mini-heart';
    mh.innerHTML = '❤️';
    mh.style.left = '50vw';
    mh.style.top = '50vh';
    // تحديد اتجاه عشوائي للانفجار
    const tx = (Math.random() - 0.5) * 400 + 'px';
    const ty = (Math.random() - 0.5) * 400 + 'px';
    mh.style.setProperty('--tx', tx);
    mh.style.setProperty('--ty', ty);
    document.body.appendChild(mh);
    setTimeout(() => mh.remove(), 1500);
}

initParticles();
animate();

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    if (isHeartFormed) setHeartShape();
});