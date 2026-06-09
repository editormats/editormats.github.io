/* ── Nav scroll state ──────────────────────────────── */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 30);
}, { passive: true });

/* ── Smooth-scroll nav links ───────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
        const target = document.querySelector(link.getAttribute('href'));
        if (!target) return;
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
});

/* ── Scroll reveal ─────────────────────────────────── */
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.07, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ── Active nav link on scroll ─────────────────────── */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            navLinks.forEach(link => {
                link.style.color = link.getAttribute('href') === `#${id}` ? 'var(--text)' : '';
            });
        }
    });
}, { threshold: 0.4 });

sections.forEach(s => sectionObserver.observe(s));

/* ── Mobile nav toggle ─────────────────────────────── */
const mobileToggle = document.getElementById('mobileToggle');
const navLinksEl = document.querySelector('.nav-links');
let mobileOpen = false;

if (mobileToggle) {
    mobileToggle.addEventListener('click', () => {
        mobileOpen = !mobileOpen;
        mobileToggle.classList.toggle('open', mobileOpen);
        if (mobileOpen) {
            navLinksEl.style.cssText = `
                display:flex;flex-direction:column;position:fixed;top:60px;left:0;right:0;
                background:rgba(6,6,6,0.97);border-bottom:1px solid var(--border);
                padding:1.5rem 2rem;gap:1.5rem;backdrop-filter:blur(16px);z-index:199;
            `;
        } else {
            navLinksEl.removeAttribute('style');
        }
    });
    navLinksEl.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            if (mobileOpen) {
                mobileOpen = false;
                mobileToggle.classList.remove('open');
                navLinksEl.removeAttribute('style');
            }
        });
    });
}

/* ── Hero wordmark — character split animation ─────── */
(function animateWordmark() {
    const wm = document.querySelector('.hero-wordmark');
    if (!wm) return;
    const accent = 'Mats', normal = 'Koning';
    wm.innerHTML =
        [...accent].map((c, i) => `<span class="hc accent" style="--ci:${i}">${c}</span>`).join('') +
        [...normal].map((c, i) => `<span class="hc" style="--ci:${i + accent.length}">${c}</span>`).join('');
})();

/* ── Film grain overlay ────────────────────────────── */
(function addGrain() {
    const grain = document.createElement('div');
    grain.style.cssText = `
        position:fixed;inset:0;z-index:9990;pointer-events:none;
        opacity:0.028;
        background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.72' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)'/%3E%3C/svg%3E");
        background-size:200px 200px;
    `;
    document.body.appendChild(grain);
})();

/* ── Custom cursor (desktop only) ─────────────────── */
if (window.matchMedia('(pointer: fine)').matches) {
    const dot  = document.createElement('div');
    const ring = document.createElement('div');
    dot.className  = 'cursor-dot';
    ring.className = 'cursor-ring';
    document.body.append(dot, ring);

    let mx = 0, my = 0, rx = 0, ry = 0, visible = false;

    document.addEventListener('mousemove', e => {
        mx = e.clientX; my = e.clientY;
        if (!visible) { rx = mx; ry = my; }
        dot.style.opacity  = '1';
        ring.style.opacity = '1';
        visible = true;
        dot.style.transform = `translate(${mx}px,${my}px) translate(-50%,-50%)`;
    }, { passive: true });

    document.addEventListener('mouseleave', () => {
        dot.style.opacity = ring.style.opacity = '0';
        visible = false;
    });

    document.addEventListener('mousedown', () => ring.classList.add('clicked'));
    document.addEventListener('mouseup',   () => ring.classList.remove('clicked'));

    const interactables = 'a, button, .tool, .work-card, .work-featured, .contact-row';
    document.querySelectorAll(interactables).forEach(el => {
        el.addEventListener('mouseenter', () => ring.classList.add('hover'));
        el.addEventListener('mouseleave', () => ring.classList.remove('hover'));
    });

    /* ring follows with lag via lerp */
    (function loop() {
        rx += (mx - rx) * 0.11;
        ry += (my - ry) * 0.11;
        ring.style.transform = `translate(${rx}px,${ry}px) translate(-50%,-50%)`;
        requestAnimationFrame(loop);
    })();
}

/* ── Contact form → mailto ─────────────────────────── */
function handleContactForm(e) {
    e.preventDefault();
    const name    = document.getElementById('contact-name').value;
    const company = document.getElementById('contact-company').value;
    const scope   = document.getElementById('contact-scope').value;
    const subject = encodeURIComponent(`Project Enquiry — ${company || name}`);
    const body    = encodeURIComponent(`Name: ${name}\nCompany: ${company || '—'}\n\nProject Scope:\n${scope}`);
    window.location.href = `mailto:mats30koning@gmail.com?subject=${subject}&body=${body}`;
}

/* ── 3D tilt on work cards ─────────────────────────── */
document.querySelectorAll('.work-card, .work-featured').forEach(card => {
    card.addEventListener('mousemove', e => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width  - 0.5;
        const y = (e.clientY - r.top)  / r.height - 0.5;
        card.style.transform  = `perspective(1100px) rotateY(${x * 4}deg) rotateX(${-y * 4}deg)`;
        card.style.transition = 'transform 0.08s ease, border-color 0.3s ease, box-shadow 0.3s ease';
    });
    card.addEventListener('mouseleave', () => {
        card.style.transform  = '';
        card.style.transition = 'transform 0.55s var(--ease), border-color 0.3s ease, box-shadow 0.3s ease';
    });
});
