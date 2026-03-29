// ── FLOATING BACKGROUND ELEMENTS ──
const floatingElements = document.getElementById('floatingElements');
for (let i = 0; i < 15; i++) {
    const element = document.createElement('div');
    element.classList.add('floating-element');
    const size = Math.random() * 200 + 50;
    element.style.cssText = `
        width:${size}px; height:${size}px;
        left:${Math.random()*100}%;
        top:${Math.random()*100}%;
        animation: float ${Math.random()*20+20}s infinite ease-in-out;
    `;
    floatingElements.appendChild(element);
}
const floatStyle = document.createElement('style');
floatStyle.textContent = `
    @keyframes float {
        0%,100% { transform: translate(0,0) rotate(0deg); }
        25%  { transform: translate(20px,-20px) rotate(5deg); }
        50%  { transform: translate(-15px,10px) rotate(-5deg); }
        75%  { transform: translate(10px,15px) rotate(3deg); }
    }
`;
document.head.appendChild(floatStyle);

// ── MOBILE MENU ──
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const mobileNav        = document.getElementById('mobileNav');
const mobileOverlay    = document.getElementById('mobileOverlay');
const scrollDownArrow  = document.querySelector('.scroll-down');

function toggleMobileMenu() {
    mobileMenuToggle.classList.toggle('active');
    mobileNav.classList.toggle('active');
    mobileOverlay.classList.toggle('active');
    document.body.style.overflow = mobileNav.classList.contains('active') ? 'hidden' : '';
}
function closeMobileMenu() {
    mobileMenuToggle.classList.remove('active');
    mobileNav.classList.remove('active');
    mobileOverlay.classList.remove('active');
    document.body.style.overflow = '';
}
mobileMenuToggle.addEventListener('click', toggleMobileMenu);
document.querySelectorAll('.mobile-nav a').forEach(l => l.addEventListener('click', closeMobileMenu));

// ── FADE IN ON SCROLL ──
const fadeElements = document.querySelectorAll('.fade-in');
const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.1 });
fadeElements.forEach(el => observer.observe(el));

// ── NAV SCROLL BEHAVIOUR ──
const nav = document.getElementById('mainNav');
let lastScrollTop = 0;
window.addEventListener('scroll', function () {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    nav.classList.toggle('scrolled', scrollTop > 50);
    if (scrollDownArrow) {
        if (scrollTop > 100) {
            scrollDownArrow.style.opacity = '0';
            scrollDownArrow.style.visibility = 'hidden';
            scrollDownArrow.style.transform = 'translateX(-50%) translateY(20px)';
        } else {
            scrollDownArrow.style.opacity = '1';
            scrollDownArrow.style.visibility = 'visible';
            scrollDownArrow.style.transform = 'translateX(-50%) translateY(0)';
        }
    }
    lastScrollTop = scrollTop;
});

// ── SCROLL TO TOP BUTTON ──
const scrollToTopBtn = document.getElementById('scrollToTop');
window.addEventListener('scroll', () => {
    scrollToTopBtn.classList.toggle('visible', window.pageYOffset > 300);
});
scrollToTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// ── SMOOTH ANCHOR SCROLL ──
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        const targetEl = document.querySelector(targetId);
        if (targetEl) {
            e.preventDefault();
            closeMobileMenu();
            window.scrollTo({ top: targetEl.offsetTop - nav.offsetHeight, behavior: 'smooth' });
        }
    });
});

// ── ACTIVE NAV LINK ──
const sections  = document.querySelectorAll('section');
const navLinks  = document.querySelectorAll('.nav-links a, .mobile-nav a');
function highlightNavLink() {
    let current = '';
    sections.forEach(section => {
        if (window.scrollY >= section.offsetTop - nav.offsetHeight - 100) {
            current = section.getAttribute('id');
        }
    });
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) link.classList.add('active');
    });
}
window.addEventListener('scroll', highlightNavLink);

const activeStyle = document.createElement('style');
activeStyle.textContent = `
    .nav-links a.active { color: var(--primary) !important; }
    .nav-links a.active::after { width: 100% !important; }
    .mobile-nav a.active { background: rgba(99,102,241,0.15) !important; }
`;
document.head.appendChild(activeStyle);

// ── SECURITY POPUP ──
function showSecurityPopup(message) {
    ['securityPopup','securityPopupOverlay'].forEach(id => {
        const el = document.getElementById(id); if (el) el.remove();
    });
    const overlay = document.createElement('div');
    overlay.id = 'securityPopupOverlay';
    document.body.appendChild(overlay);

    const popup = document.createElement('div');
    popup.id = 'securityPopup';
    popup.innerHTML = `
        <div style="margin-bottom:20px">
            <div style="width:60px;height:60px;background:var(--gradient-1);border-radius:50%;
                        display:flex;align-items:center;justify-content:center;margin:0 auto 20px">
                <i class="fas fa-shield-alt" style="font-size:24px;color:white"></i>
            </div>
            <h3 style="color:white;margin-bottom:10px">Security Notice</h3>
            <p style="color:var(--gray);line-height:1.5">${message}</p>
        </div>
        <button id="closePopup" style="background:var(--gradient-1);color:white;border:none;
            padding:12px 30px;border-radius:8px;font-weight:600;cursor:pointer;font-size:1rem">
            Understood
        </button>`;
    document.body.appendChild(popup);

    const close = () => { popup.remove(); overlay.remove(); };
    document.getElementById('closePopup').addEventListener('click', close);
    overlay.addEventListener('click', close);
    setTimeout(() => { if (document.body.contains(popup)) close(); }, 5000);
}

// Disable right-click
document.addEventListener('contextmenu', e => { e.preventDefault(); showSecurityPopup('Right-click is disabled on this page.'); });

// Disable dev tools shortcuts
document.addEventListener('keydown', e => {
    const blocked = [
        e.key === 'F12',
        e.ctrlKey && e.shiftKey && ['I','J','C'].includes(e.key),
        e.metaKey && e.altKey  && ['i','j','c'].includes(e.key),
        (e.ctrlKey || e.metaKey) && e.key === 'u'
    ];
    if (blocked.some(Boolean)) {
        e.preventDefault();
        showSecurityPopup('Developer tools are disabled.');
    }
});

// Disable text selection & image drag
document.addEventListener('selectstart', e => e.preventDefault());
document.addEventListener('dragstart',   e => { if (e.target.tagName === 'IMG') e.preventDefault(); });

// Dev tools detection
let devtoolsOpen = false;
setInterval(() => {
    const t0 = performance.now();
    console.debug('DevTools Check');
    if (performance.now() - t0 > 100) {
        if (!devtoolsOpen) { devtoolsOpen = true; showSecurityPopup('Developer tools detected. Please close them.'); }
    } else { devtoolsOpen = false; }
    console.clear();
}, 1000);
