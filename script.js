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
}, {
    threshold: 0.08,
    rootMargin: '0px 0px -48px 0px'
});

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ── Active nav link on scroll ─────────────────────── */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            navLinks.forEach(link => {
                link.style.color = link.getAttribute('href') === `#${id}`
                    ? 'var(--text)'
                    : '';
            });
        }
    });
}, {
    threshold: 0.4,
});

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
            navLinksEl.style.display = 'flex';
            navLinksEl.style.flexDirection = 'column';
            navLinksEl.style.position = 'fixed';
            navLinksEl.style.top = '60px';
            navLinksEl.style.left = '0';
            navLinksEl.style.right = '0';
            navLinksEl.style.background = 'rgba(8,8,8,0.97)';
            navLinksEl.style.borderBottom = '1px solid var(--border)';
            navLinksEl.style.padding = '1.5rem 2rem';
            navLinksEl.style.gap = '1.5rem';
            navLinksEl.style.backdropFilter = 'blur(12px)';
        } else {
            navLinksEl.removeAttribute('style');
        }
    });

    // Close on link click
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

/* ── Cursor accent dot (desktop only) ─────────────── */
if (window.matchMedia('(pointer: fine)').matches) {
    const dot = document.createElement('div');
    dot.style.cssText = `
        position: fixed;
        width: 5px;
        height: 5px;
        background: var(--accent);
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        mix-blend-mode: screen;
        transition: transform 0.15s ease, opacity 0.15s ease;
        opacity: 0;
    `;
    document.body.appendChild(dot);

    let cx = 0, cy = 0;
    document.addEventListener('mousemove', e => {
        cx = e.clientX;
        cy = e.clientY;
        dot.style.left = cx - 2.5 + 'px';
        dot.style.top  = cy - 2.5 + 'px';
        dot.style.opacity = '0.7';
    }, { passive: true });

    document.addEventListener('mouseleave', () => {
        dot.style.opacity = '0';
    });

    // Enlarge on interactive elements
    document.querySelectorAll('a, button, .tool').forEach(el => {
        el.addEventListener('mouseenter', () => {
            dot.style.transform = 'scale(3.5)';
            dot.style.opacity = '0.4';
        });
        el.addEventListener('mouseleave', () => {
            dot.style.transform = 'scale(1)';
            dot.style.opacity = '0.7';
        });
    });
}
