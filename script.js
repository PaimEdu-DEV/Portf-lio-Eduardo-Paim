/* =========================================
   PORTFOLIO — script.js
   Cursor · Nav · Stats · Filters · Reveal
========================================= */

/* ── CUSTOM CURSOR ── */
const cursor = document.getElementById('cursor');
const follower = document.getElementById('cursorFollower');
let mouseX = 0, mouseY = 0;
let followerX = 0, followerY = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursor.style.left = mouseX + 'px';
  cursor.style.top  = mouseY + 'px';
});

(function animFollower() {
  followerX += (mouseX - followerX) * 0.12;
  followerY += (mouseY - followerY) * 0.12;
  follower.style.left = followerX + 'px';
  follower.style.top  = followerY + 'px';
  requestAnimationFrame(animFollower);
})();

/* Hover state */
const hoverTargets = 'a, button, .filter-btn, .project-card, .social-btn, .card-link';
document.querySelectorAll(hoverTargets).forEach(el => {
  el.addEventListener('mouseenter', () => document.body.classList.add('hovering'));
  el.addEventListener('mouseleave', () => document.body.classList.remove('hovering'));
});

/* Hide cursor when outside window */
document.addEventListener('mouseleave', () => {
  cursor.style.opacity = '0';
  follower.style.opacity = '0';
});
document.addEventListener('mouseenter', () => {
  cursor.style.opacity = '1';
  follower.style.opacity = '1';
});

/* ── STICKY NAV ── */
const nav = document.querySelector('.nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

/* ── MOBILE NAV TOGGLE ── */
const navToggle = document.getElementById('navToggle');
navToggle.addEventListener('click', () => {
  nav.classList.toggle('open');
  document.body.style.overflow = nav.classList.contains('open') ? 'hidden' : '';
});

/* Close mobile nav on link click */
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    nav.classList.remove('open');
    document.body.style.overflow = '';
  });
});

/* ── ANIMATED COUNTERS ── */
function easeOutExpo(t) {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

function animateCounter(el) {
  const target = parseInt(el.dataset.count, 10);
  const duration = 1800;
  const start = performance.now();

  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = easeOutExpo(progress);
    el.textContent = Math.round(eased * target) + (el.dataset.suffix || '+');
    if (progress < 1) requestAnimationFrame(update);
    else el.textContent = target + '+';
  }
  requestAnimationFrame(update);
}

/* ── INTERSECTION OBSERVER ── */
const observerOpts = { threshold: 0.15, rootMargin: '0px 0px -60px 0px' };

/* Reveal elements */
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, observerOpts);

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* Counter observer */
const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-num[data-count]').forEach(el => counterObserver.observe(el));

/* ── PROJECT FILTERS ── */
const filterBtns = document.querySelectorAll('.filter-btn');
const cards = document.querySelectorAll('.project-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    /* Update active button */
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;

    cards.forEach((card, i) => {
      const match = filter === 'all' || card.dataset.category === filter;
      if (match) {
        card.classList.remove('hidden');
        /* Stagger re-entry */
        card.style.setProperty('--delay', (i * 60) + 'ms');
        setTimeout(() => card.classList.add('visible'), 10);
      } else {
        card.classList.add('hidden');
        card.classList.remove('visible');
      }
    });
  });
});

/* ── SMOOTH ACTIVE NAV ON SCROLL ── */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navLinks.forEach(link => {
        link.style.color = link.getAttribute('href') === `#${id}`
          ? 'var(--text)' : '';
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => sectionObserver.observe(s));

/* ── REVEAL SECTIONS ON SCROLL ── */
const sectionRevealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.section-header, .about-grid, .filters, .projects-grid, .contact-inner')
        .forEach((el, i) => {
          el.style.transition = `opacity 0.8s cubic-bezier(0.16,1,0.3,1) ${i * 80}ms, transform 0.8s cubic-bezier(0.16,1,0.3,1) ${i * 80}ms`;
          el.style.opacity = '1';
          el.style.transform = 'translateY(0)';
        });
      sectionRevealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.about, .projects, .contact').forEach(section => {
  section.querySelectorAll('.section-header, .about-grid, .filters, .projects-grid, .contact-inner')
    .forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(40px)';
    });
  sectionRevealObserver.observe(section);
});

/* ── CARD 3D TILT ── */
document.querySelectorAll('.card-inner').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `translateY(-4px) rotateY(${x * 4}deg) rotateX(${-y * 4}deg)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

/* ── HERO TITLE GLITCH ON HOVER ── */
document.querySelectorAll('.hero-title .line').forEach(line => {
  const original = line.textContent;
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

  line.addEventListener('mouseenter', () => {
    let iter = 0;
    const interval = setInterval(() => {
      line.textContent = original.split('').map((ch, idx) => {
        if (idx < iter) return original[idx];
        if (ch === ' ') return ' ';
        return chars[Math.floor(Math.random() * chars.length)];
      }).join('');
      iter += 0.5;
      if (iter >= original.length) {
        clearInterval(interval);
        line.textContent = original;
      }
    }, 30);
  });
});

/* ── PAGE LOAD SEQUENCE ── */
window.addEventListener('load', () => {
  document.body.style.opacity = '1';
  /* Trigger hero stats counter after short delay */
  setTimeout(() => {
    document.querySelectorAll('.stat-num[data-count]').forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight) animateCounter(el);
    });
  }, 800);
});