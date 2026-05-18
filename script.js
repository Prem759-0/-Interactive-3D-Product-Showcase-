// ---- CURSOR ----
const cursor = document.getElementById('cursor');
const ring = document.getElementById('cursor-ring');
let cx = 0, cy = 0, rx = 0, ry = 0;
document.addEventListener('mousemove', e => { cx = e.clientX; cy = e.clientY; });
(function animCursor() {
  cursor.style.left = cx + 'px'; cursor.style.top = cy + 'px';
  rx += (cx - rx) * 0.12; ry += (cy - ry) * 0.12;
  ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
  requestAnimationFrame(animCursor);
})();
 
// ---- 3D CARD ----
const wrap = document.getElementById('card3d-wrap');
const card = document.getElementById('card3d');
const glow = document.getElementById('cardGlow');
let targetRX = 0, targetRY = 0, curRX = 0, curRY = 0;
 
wrap.addEventListener('mousemove', e => {
  const r = wrap.getBoundingClientRect();
  const x = (e.clientX - r.left) / r.width - 0.5;
  const y = (e.clientY - r.top) / r.height - 0.5;
  targetRY = x * 30; targetRX = -y * 20;
  glow.style.left = (e.clientX - r.left) + 'px';
  glow.style.top = (e.clientY - r.top) + 'px';
  glow.style.opacity = '1';
});
wrap.addEventListener('mouseleave', () => {
  targetRX = 0; targetRY = 0;
  glow.style.opacity = '0';
});
 
(function animCard() {
  curRX += (targetRX - curRX) * 0.08;
  curRY += (targetRY - curRY) * 0.08;
  card.style.transform = `rotateX(${curRX}deg) rotateY(${curRY}deg)`;
  requestAnimationFrame(animCard);
})();
 
// IDLE card float
let idleAngle = 0;
setInterval(() => {
  if (Math.abs(targetRX) < 0.1 && Math.abs(targetRY) < 0.1) {
    idleAngle += 0.01;
    card.style.transform = `rotateX(${Math.sin(idleAngle) * 5}deg) rotateY(${Math.cos(idleAngle * 0.7) * 8}deg)`;
  }
}, 16);
 
// PARTICLES on card
const particleContainer = document.getElementById('cardParticles');
function spawnParticle() {
  const p = document.createElement('div');
  p.className = 'p-dot';
  const size = Math.random() * 4 + 2;
  const colors = ['#6c63ff','#43e8d8','#ff6584','#f0c040'];
  p.style.cssText = `
    width:${size}px; height:${size}px;
    left:${Math.random()*90+5}%;
    bottom:${Math.random()*30}%;
    background:${colors[Math.floor(Math.random()*colors.length)]};
    animation-duration:${Math.random()*3+2}s;
    animation-delay:${Math.random()*2}s;
  `;
  particleContainer.appendChild(p);
  setTimeout(() => p.remove(), 5000);
}
setInterval(spawnParticle, 400);
 
// ---- HERO COUNTERS ----
function animCounter(el, target, suffix, prefix) {
  let current = 0;
  const step = target / 60;
  const t = setInterval(() => {
    current = Math.min(current + step, target);
    el.textContent = Math.floor(current);
    if (current >= target) clearInterval(t);
  }, 25);
}
setTimeout(() => {
  animCounter(document.getElementById('cnt1'), 12);
  animCounter(document.getElementById('cnt2'), 48);
  animCounter(document.getElementById('cnt3'), 38);
}, 800);
 
// ---- SCROLL OBSERVER ----
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      // stat counters
      e.target.querySelectorAll('.stat-counter').forEach(el => {
        const target = parseFloat(el.dataset.target);
        let current = 0;
        const step = target / 60;
        const t = setInterval(() => {
          current = Math.min(current + step, target);
          el.textContent = target < 10 ? current.toFixed(1) : Math.floor(current);
          if (current >= target) clearInterval(t);
        }, 25);
      });
    }
  });
}, { threshold: 0.15 });
 
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
 
// Feature cards stagger
const featObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const cards = e.target.querySelectorAll('.feat-card');
      cards.forEach((c, i) => {
        c.style.animationDelay = (i * 0.1) + 's';
        c.classList.add('visible');
      });
    }
  });
}, { threshold: 0.1 });
const featSection = document.querySelector('.features-grid');
if (featSection) featObs.observe(featSection);
 
// Feature card mouse parallax
document.querySelectorAll('.feat-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * 100;
    const y = ((e.clientY - r.top) / r.height) * 100;
    card.style.setProperty('--mx', x + '%');
    card.style.setProperty('--my', y + '%');
  });
});
 
// ---- TESTIMONIALS ----
const testimonials = [
  { text: "AURA replaced my entire banking setup. The AI spend alerts alone saved me $400 last month.", name: "Sarah K.", role: "Product Designer", rating: 5, initials: "SK", color: "#6c63ff" },
  { text: "The fastest international transfers I've ever used. My team abroad gets money in under 10 seconds.", name: "Marcus L.", role: "Startup Founder", rating: 5, initials: "ML", color: "#43e8d8" },
  { text: "Finally a financial product that doesn't feel like it was designed in 2010. The UX is exceptional.", name: "Priya M.", role: "UX Lead @ Google", rating: 5, initials: "PM", color: "#ff6584" },
  { text: "Their fraud detection caught a suspicious charge before I even saw it. Pure magic.", name: "James W.", role: "Freelance Dev", rating: 5, initials: "JW", color: "#f0c040" },
  { text: "Switched from three different apps to just AURA. Everything is in one place, it's incredible.", name: "Aisha N.", role: "Financial Analyst", rating: 5, initials: "AN", color: "#6c63ff" },
  { text: "The 3% cashback with no cap is real. I've earned back more than the subscription 10x over.", name: "Tom R.", role: "E-commerce Owner", rating: 5, initials: "TR", color: "#43e8d8" },
];
 
const track = document.getElementById('tTrack');
const allT = [...testimonials, ...testimonials]; // duplicate for loop
allT.forEach(t => {
  const card = document.createElement('div');
  card.className = 't-card';
  card.innerHTML = `
    <div class="t-stars">${'★'.repeat(t.rating)}</div>
    <p class="t-text">"${t.text}"</p>
    <div class="t-author">
      <div class="t-avatar" style="background:${t.color}22;color:${t.color}">${t.initials}</div>
      <div>
        <div class="t-name">${t.name}</div>
        <div class="t-role">${t.role}</div>
      </div>
    </div>
  `;
  track.appendChild(card);
});
