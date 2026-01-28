const sCanvas = document.getElementById('starCanvas');
const hCanvas = document.getElementById('heartCanvas');
const sCtx = sCanvas.getContext('2d');
const hCtx = hCanvas.getContext('2d');

const yesBtn = document.getElementById('yesBtn');
const noBtn = document.getElementById('noBtn');
const qContainer = document.getElementById('questionContainer');
const rContainer = document.getElementById('resultContainer');
const nameContainer = document.getElementById('nameContainer');
const heartToggleBtn = document.getElementById('heartToggleBtn');

let stars = [];
let particles = [];
let mode = 'NANO'; 
let frames = 0;
let isHeartVisible = false;

function resize() {
    sCanvas.width = hCanvas.width = window.innerWidth;
    sCanvas.height = hCanvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

// 1. نجوم الخلفية RGB هادئة
class Star {
    constructor() {
        this.x = Math.random() * sCanvas.width;
        this.y = Math.random() * sCanvas.height;
        this.hue = Math.random() * 360;
    }
    draw() {
        sCtx.fillStyle = `hsl(${this.hue}, 70%, 70%)`;
        sCtx.beginPath();
        sCtx.arc(this.x, this.y, Math.random() * 1.5, 0, Math.PI * 2);
        sCtx.fill();
        this.hue += 0.3;
    }
}
for(let i=0; i<150; i++) stars.push(new Star());

// 2. زر No يهرب
noBtn.addEventListener('mouseover', () => {
    const x = Math.random() * (window.innerWidth - 150);
    const y = Math.random() * (window.innerHeight - 100);
    noBtn.style.position = 'absolute';
    noBtn.style.left = x + 'px';
    noBtn.style.top = y + 'px';
});

// 3. الانتقال عند Yes
yesBtn.addEventListener('click', () => {
    qContainer.classList.add('hidden');
    rContainer.classList.remove('hidden');
    
    setTimeout(() => {
        rContainer.style.opacity = '0';
        setTimeout(() => {
            rContainer.classList.add('hidden');
            isHeartVisible = true;
            nameContainer.style.opacity = '1';
            heartToggleBtn.classList.remove('hidden');
            initNano();
            setHeartDest();
            spawnBoxes();
        }, 1000);
    }, 3000);
});

// 4. نظام جزيئات النانو (النمط الأول)
class Particle {
    constructor() {
        this.x = Math.random() * hCanvas.width;
        this.y = Math.random() * hCanvas.height;
        this.destX = this.x; this.destY = this.y;
        this.speed = Math.random() * 0.05 + 0.02;
    }
    update() {
        this.x += (this.destX - this.x) * this.speed;
        this.y += (this.destY - this.y) * this.speed;
    }
    draw() {
        hCtx.fillStyle = '#ff69b4';
        hCtx.beginPath(); hCtx.arc(this.x, this.y, 2, 0, Math.PI * 2); hCtx.fill();
    }
}

function initNano() {
    particles = [];
    for(let i=0; i<600; i++) particles.push(new Particle());
}

function setHeartDest() {
    let index = 0;
    for (let t = 0; t < Math.PI * 2; t += (Math.PI * 2) / 600) {
        if(index >= particles.length) break;
        let x = 16 * Math.pow(Math.sin(t), 3);
        let y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
        particles[index].destX = x * 15 + hCanvas.width / 2;
        particles[index].destY = y * 15 + hCanvas.height / 2;
        index++;
    }
}

// 5. النمط الثاني المطور (تأثير النفق والتردد الهادئ)
function drawMirrorHeart() {
    frames += 0.02;
    
    const centerX = hCanvas.width / 2;
    const centerY = hCanvas.height / 2;
    
    // رسم عدة طبقات من القلب للداخل لخلق تأثير "الشاشة المشتركة"
    for (let j = 0; j < 6; j++) {
        // حساب مقياس النبض (التردد)
        let pulse = Math.sin(frames - j * 0.5) * 5;
        let scale = (15 - j * 2) + pulse; 
        
        if (scale < 0) continue;

        hCtx.beginPath();
        hCtx.strokeStyle = "#ff69b4";
        hCtx.lineWidth = 0.5;
        hCtx.globalAlpha = (1 - j * 0.15); // يتلاشى كلما دخل للخلف

        for (let i = 0; i < Math.PI * 2; i += 0.05) {
            let x = 16 * Math.pow(Math.sin(i), 3) * scale;
            let y = -(13 * Math.cos(i) - 5 * Math.cos(2 * i) - 2 * Math.cos(3 * i) - Math.cos(4 * i)) * scale;
            
            // إضافة دوران بسيط جداً لزيادة الهدوء
            let rotX = x * Math.cos(frames * 0.2) - y * Math.sin(frames * 0.2);
            let rotY = x * Math.sin(frames * 0.2) + y * Math.cos(frames * 0.2);
            
            if (i === 0) hCtx.moveTo(centerX + rotX, centerY + rotY);
            else hCtx.lineTo(centerX + rotX, centerY + rotY);
        }
        hCtx.closePath();
        hCtx.stroke();
    }
}

function animate() {
    // رسم النجوم باستمرار
    sCtx.fillStyle = 'black';
    sCtx.fillRect(0, 0, sCanvas.width, sCanvas.height);
    stars.forEach(s => s.draw());

    if (isHeartVisible) {
        // مسح الشاشة بالكامل في كل كادر لضمان الوضوح وعدم التراكم
        hCtx.clearRect(0, 0, hCanvas.width, hCanvas.height);
        
        if (mode === 'NANO') {
            particles.forEach(p => { p.update(); p.draw(); });
        } else {
            drawMirrorHeart();
        }
    }
    requestAnimationFrame(animate);
}

heartToggleBtn.addEventListener('click', () => {
    mode = (mode === 'NANO') ? 'MIRROR' : 'NANO';
    if(mode === 'NANO') { initNano(); setHeartDest(); }
});

function spawnBoxes() {
    setInterval(() => {
        const b = document.createElement('div');
        b.className = 'box';
        b.style.left = Math.random() * 100 + 'vw';
        b.style.borderColor = `hsl(${Math.random() * 360}, 100%, 70%)`;
        document.body.appendChild(b);
        setTimeout(() => b.remove(), 3000);
    }, 400);
}

animate();