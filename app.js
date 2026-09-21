// --- Verses Data ---
const verses = [
    {
        title: "En este bosque bajo las estrellas...",
        text: "Eres la luz dorada que ilumina cada rincón de mi mundo con una ternura infinita y un amor que desafía al tiempo."
    },
    {
        title: "El brillo de tu mirada...",
        text: "Es más hermoso que todas las constelaciones juntas. Cada vez que sonríes, el universo entero se detiene a admirarte."
    },
    {
        title: "Un refugio dorado...",
        text: "A tu lado, cualquier lugar se convierte en nuestro hogar. Tus brazos son el refugio seguro donde siempre quiero habitar."
    },
    {
        title: "Flores amarillas en septiembre...",
        text: "Simbolizan la promesa de estar juntos en cada primavera y en cada invierno, floreciendo siempre con renovada pasión."
    },
    {
        title: "Bajo el cielo estrellado...",
        text: "Pedí un deseo al ver una estrella fugaz, y mi sorpresa fue descubrir que ya te tenía a ti, mi sueño hecho realidad."
    },
    {
        title: "Nuestra historia sin final...",
        text: "Cada capítulo a tu lado es una obra de arte. Gracias por escribir conmigo este cuento de hadas que no termina jamás."
    },
    {
        title: "Promesa eterna...",
        text: "Te amo en las buenas y en las auroras boreales, en los días soleados y en las noches calmadas. Eres mi para siempre."
    },
    {
        title: "El Amor de Mi Vida...",
        text: "No existen palabras suficientes para agradecer tu existencia. Eres el latido más hermoso de mi corazón y mi razón de sonreír."
    }
];

let currentIndex = 0;
let isAudioPlaying = false;
let synth, chimeSynth;

// --- Initialize Audio with Tone.js ---
function initAudio() {
    if (synth) return;
    synth = new Tone.PolySynth(Tone.Synth, {
        oscillator: { type: "sine" },
        envelope: { attack: 2, decay: 1, sustain: 0.8, release: 3 }
    }).toDestination();
    synth.volume.value = -12;

    chimeSynth = new Tone.Synth({
        oscillator: { type: "triangle" },
        envelope: { attack: 0.05, decay: 0.3, sustain: 0, release: 0.5 }
    }).toDestination();
    chimeSynth.volume.value = -8;
}

const chordProgression = [
    ["C4", "E4", "G4", "B4"],
    ["A3", "C4", "E4", "G4"],
    ["F3", "A3", "C4", "E4"],
    ["G3", "B3", "D4", "F4"]
];

let chordIndex = 0;
let ambientLoop;

// --- Toggle Audio (Tone.js + HTML Audio) ---
function toggleAudio() {
    initAudio();
    const btnText = document.getElementById('sound-text');
    const soundIcon = document.getElementById('sound-icon');
    const backgroundMusic = document.getElementById('background-music');

    if (!isAudioPlaying) {
        Tone.start();
        isAudioPlaying = true;
        btnText.innerText = "Música Mágica: ON";
        soundIcon.classList.add("text-yellow-300", "animate-pulse");

        if (backgroundMusic) {
            backgroundMusic.play().catch(error => console.log("Audio autoplay bloqueado o error:", error));
        }

        ambientLoop = new Tone.Loop(time => {
            synth.triggerAttackRelease(chordProgression[chordIndex], "4n", time);
            chordIndex = (chordIndex + 1) % chordProgression.length;
        }, "6n").start(0);

        Tone.Transport.start();
    } else {
        isAudioPlaying = false;
        btnText.innerText = "Música Mágica: OFF";
        soundIcon.classList.remove("text-yellow-300", "animate-pulse");

        if (backgroundMusic) {
            backgroundMusic.pause();
        }

        if (ambientLoop) ambientLoop.stop();
        Tone.Transport.stop();
    }
}

// --- Render Progress Dots ---
function renderDots() {
    const container = document.getElementById('progress-dots');
    if (!container) return;
    container.innerHTML = '';
    verses.forEach((_, idx) => {
        const dot = document.createElement('div');
        dot.className = `h-1.5 rounded-full transition-all duration-300 ${idx === currentIndex ? 'w-6 bg-amber-400 shadow-[0_0_10px_#fbbf24]' : 'w-1.5 bg-amber-500/30'}`;
        container.appendChild(dot);
    });
}

// --- Update Verse ---
function updateVerse() {
    const titleEl = document.getElementById('verse-title');
    const textEl = document.getElementById('verse-text');
    const counterEl = document.getElementById('verse-counter');

    if (!titleEl || !textEl || !counterEl) return;

    titleEl.style.opacity = 0;
    textEl.style.opacity = 0;

    setTimeout(() => {
        titleEl.innerText = verses[currentIndex].title;
        textEl.innerText = verses[currentIndex].text;
        counterEl.innerText = `Capítulo ${currentIndex + 1} de ${verses.length}`;
        renderDots();

        titleEl.style.transition = "opacity 0.4s ease";
        textEl.style.transition = "opacity 0.4s ease";
        titleEl.style.opacity = 1;
        textEl.style.opacity = 1;
    }, 200);

    if (isAudioPlaying && chimeSynth) {
        const notes = ["C5", "E5", "G5", "B5", "C6"];
        chimeSynth.triggerAttackRelease(notes[currentIndex % notes.length], "8n");
    }
}

function nextVerse() {
    currentIndex = (currentIndex + 1) % verses.length;
    updateVerse();
    launchFireworksAtRandom();
}

function prevVerse() {
    currentIndex = (currentIndex - 1 + verses.length) % verses.length;
    updateVerse();
    launchFireworksAtRandom();
}

// --- Canvas for Stars and Fireworks ---
const canvas = document.getElementById('sky-canvas');
const ctx = canvas ? canvas.getContext('2d') : null;

let width, height;
let stars = [];
let shootingStars = [];
let particles = [];
let goldenPollen = [];
let mouse = { x: null, y: null };

window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});

function resizeCanvas() {
    if (!canvas) return;
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

if (canvas) {
    for (let i = 0; i < 220; i++) {
        stars.push({
            x: Math.random() * width,
            y: Math.random() * height,
            radius: Math.random() * 1.8 + 0.2,
            alpha: Math.random(),
            speed: Math.random() * 0.02 + 0.005
        });
    }

    for (let i = 0; i < 60; i++) {
        goldenPollen.push({
            x: Math.random() * width,
            y: Math.random() * height,
            radius: Math.random() * 2.5 + 1,
            speedY: -(Math.random() * 0.5 + 0.2),
            speedX: (Math.random() - 0.5) * 0.4,
            alpha: Math.random() * 0.8 + 0.2
        });
    }

    setInterval(() => {
        if (Math.random() > 0.2) {
            shootingStars.push({
                x: Math.random() * width * 0.8,
                y: 0,
                length: Math.random() * 90 + 50,
                speed: Math.random() * 14 + 8,
                angle: Math.PI / 4,
                alpha: 1
            });
        }
    }, 3000);

    setInterval(() => {
        if (Math.random() > 0.3) {
            const fx = Math.random() * width * 0.8 + width * 0.1;
            const fy = Math.random() * (height * 0.5);
            createFireworkBurst(fx, fy);
        }
    }, 3500);
}

function createFireworkBurst(x, y) {
    const colors = ['#f59e0b', '#fbbf24', '#ef4444', '#ec4899', '#8b5cf6', '#3b82f6', '#10b981', '#ffffff'];
    const chosenColor = colors[Math.floor(Math.random() * colors.length)];
    const particleCount = 70;

    for (let i = 0; i < particleCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 7 + 2;
        particles.push({
            x: x,
            y: y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            alpha: 1,
            decay: Math.random() * 0.015 + 0.008,
            color: chosenColor,
            size: Math.random() * 3.5 + 1
        });
    }
}

function triggerGrandFireworks(event) {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;

    createFireworkBurst(x, y);
    setTimeout(() => createFireworkBurst(x - 90, y - 60), 200);
    setTimeout(() => createFireworkBurst(x + 90, y - 60), 400);

    if (isAudioPlaying && chimeSynth) {
        chimeSynth.triggerAttackRelease("C6", "4n");
    }
}

function launchFireworksAtRandom() {
    if (!width || !height) return;
    const x = Math.random() * (width * 0.6) + width * 0.2;
    const y = Math.random() * (height * 0.4) + height * 0.1;
    createFireworkBurst(x, y);
}

function animateSky() {
    if (!ctx) return;
    ctx.clearRect(0, 0, width, height);

    const bgGrad = ctx.createRadialGradient(width / 2, height / 2, 50, width / 2, height / 2, Math.max(width, height));
    bgGrad.addColorStop(0, '#070b16');
    bgGrad.addColorStop(0.5, '#02040a');
    bgGrad.addColorStop(1, '#000103');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    stars.forEach(star => {
        star.alpha += star.speed;
        if (star.alpha > 1 || star.alpha < 0.2) star.speed = -star.speed;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha})`;
        ctx.fill();
    });

    goldenPollen.forEach(p => {
        p.y += p.speedY;
        p.x += p.speedX;

        if (mouse.x && mouse.y) {
            let dx = mouse.x - p.x;
            let dy = mouse.y - p.y;
            let dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 130) {
                p.x += dx * 0.025;
                p.y += dy * 0.025;
            }
        }

        if (p.y < 0) {
            p.y = height + 10;
            p.x = Math.random() * width;
        }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 215, 0, ${p.alpha})`;
        ctx.shadowBlur = 12;
        ctx.shadowColor = '#fbbf24';
        ctx.fill();
        ctx.shadowBlur = 0;
    });

    shootingStars.forEach((ss, index) => {
        ss.x += Math.cos(ss.angle) * ss.speed;
        ss.y += Math.sin(ss.angle) * ss.speed;
        ss.alpha -= 0.02;

        const grad = ctx.createLinearGradient(
            ss.x, ss.y,
            ss.x - Math.cos(ss.angle) * ss.length,
            ss.y - Math.sin(ss.angle) * ss.length
        );
        grad.addColorStop(0, `rgba(255, 255, 255, ${ss.alpha})`);
        grad.addColorStop(1, `rgba(255, 215, 0, 0)`);

        ctx.beginPath();
        ctx.moveTo(ss.x, ss.y);
        ctx.lineTo(
            ss.x - Math.cos(ss.angle) * ss.length,
            ss.y - Math.sin(ss.angle) * ss.length
        );
        ctx.strokeStyle = grad;
        ctx.lineWidth = 2;
        ctx.stroke();

        if (ss.alpha <= 0 || ss.y > height) {
            shootingStars.splice(index, 1);
        }
    });

    particles.forEach((pt, index) => {
        pt.x += pt.vx;
        pt.y += pt.vy;
        pt.vy += 0.08;
        pt.alpha -= pt.decay;

        ctx.beginPath();
        ctx.arc(pt.x, pt.y, pt.size, 0, Math.PI * 2);
        ctx.fillStyle = pt.color;
        ctx.globalAlpha = Math.max(pt.alpha, 0);
        ctx.shadowBlur = 15;
        ctx.shadowColor = pt.color;
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1.0;

        if (pt.alpha <= 0) {
            particles.splice(index, 1);
        }
    });

    requestAnimationFrame(animateSky);
}

animateSky();

// --- Control del Loader y Carga Inicial ---
window.addEventListener('load', () => {
    renderDots();
    const loader = document.getElementById('loader-screen');
    if (loader) {
        loader.style.opacity = '0';
        setTimeout(() => {
            loader.style.display = 'none';
        }, 700);
    }
});