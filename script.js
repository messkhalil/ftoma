const starCanvas = document.getElementById('starCanvas');
const heartCanvas = document.getElementById('heartCanvas');
const sCtx = starCanvas.getContext('2d');
const hCtx = heartCanvas.getContext('2d');

const input = document.getElementById('answerInput');
const catOverlay = document.getElementById('catInterface');
const heartBtn = document.getElementById('heartBtn');
const nameContainer = document.getElementById('nameContainer');

let stars = [];
let heartParticles = [];
let isHeartActive = false;

function resize() {
    starCanvas.width = heartCanvas.width = window.innerWidth;
    starCanvas.height = heartCanvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

// 1. نجوم تتغير ألوانها RGB
class Star {
    constructor() {
        this.x = Math.random() * starCanvas.width;
        this.y = Math.random() * starCanvas.height;
        this.size = Math.random() * 2.5;
        this.hue = Math.random() * 360;
    }
    draw() {
        sCtx.fillStyle = `hsl(${this.hue}, 80%, 80%)`;
        sCtx.beginPath();
        sCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        sCtx.fill();
        this.hue += 1; // سرعة تغيير لون النجمة
    }
}

for (let i = 0; i < 150; i++) stars.push(new Star());

// 2. جزيئات القلب النانو
class Particle {
    constructor() {
        this.x = Math.random() * heartCanvas.width;
        this.y = Math.random() * heartCanvas.height;
        this.destX = this.x;
        this.destY = this.y;
        this.speed = Math.random() * 0.05 + 0.02;
    }
    update() {
        this.x += (this.destX - this.x) * this.speed;
        this.y += (this.destY - this.y) * this.speed;
    }
    draw() {
        hCtx.fillStyle = '#ff69b4'; // وردي للقلب
        hCtx.shadowBlur = 10;
        hCtx.shadowColor = '#fff';
        hCtx.beginPath();
        hCtx.arc(this.x, this.y, 2, 0, Math.PI * 2);
        hCtx.fill();
    }
}

function initHeart() {
    heartParticles = [];
    for (let i = 0; i < 600; i++) heartParticles.push(new Particle());
}

function setHeartShape() {
    let index = 0;
    for (let t = 0; t < Math.PI * 2; t += (Math.PI * 2) / 600) {
        if (index >= heartParticles.length) break;
        let x = 16 * Math.pow(Math.sin(t), 3);
        let y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
        heartParticles[index].destX = x * 18 + heartCanvas.width / 2;
        heartParticles[index].destY = y * 18 + heartCanvas.height / 2;
        index++;
    }
}

function animate() {
    // رسم خلفية النجوم
    sCtx.fillStyle = 'black';
    sCtx.fillRect(0, 0, starCanvas.width, starCanvas.height);
    stars.forEach(s => s.draw());

    // رسم القلب النانو
    hCtx.clearRect(0, 0, heartCanvas.width, heartCanvas.height);
    heartParticles.forEach(p => {
        p.update();
        p.draw();
    });

    requestAnimationFrame(animate);
}

// التفاعلات
input.addEventListener('input', (e) => {
    if (e.target.value.toLowerCase() === 'yes') {
        catOverlay.style.display = 'none';
        heartBtn.classList.remove('hidden');
        spawnBoxes();
    }
});

heartBtn.addEventListener('click', () => {
    isHeartActive = true;
    setHeartShape(); 
    nameContainer.style.opacity = '1'; 
    for (let i = 0; i < 50; i++) createMiniHeart();
});

function spawnBoxes() {
    setInterval(() => {
        if (isHeartActive) return;
        const b = document.createElement('div');
        b.className = 'box';
        b.style.left = Math.random() * 100 + 'vw';
        b.style.borderColor = `hsl(${Math.random() * 360}, 100%, 70%)`;
        document.body.appendChild(b);
        setTimeout(() => b.remove(), 3000);
    }, 400);
}

function createMiniHeart() {
    const mh = document.createElement('div');
    mh.className = 'mini-heart';
    mh.innerHTML = Math.random() > 0.5 ? '💗' : '🤍';
    mh.style.left = '50vw';
    mh.style.top = '50vh';
    const tx = (Math.random() - 0.5) * 600 + 'px';
    const ty = (Math.random() - 0.5) * 600 + 'px';
    mh.style.setProperty('--tx', tx);
    mh.style.setProperty('--ty', ty);
    document.body.appendChild(mh);
    setTimeout(() => mh.remove(), 1500);
}

initHeart();
animate();