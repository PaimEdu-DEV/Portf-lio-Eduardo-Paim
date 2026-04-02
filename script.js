/* =========================================
   PORTFOLIO — script.js (FULL FIXED)
   Cursor · Nav · Stats · Filters · Reveal
========================================= */

document.addEventListener('DOMContentLoaded', () => {

/* ── CUSTOM CURSOR ── */
const cursor = document.getElementById('cursor');
const follower = document.getElementById('cursorFollower');

if (cursor && follower) {
  let mouseX = 0, mouseY = 0;
  let followerX = 0, followerY = 0;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top  = mouseY + 'px';
  });

  function animateFollower() {
    followerX += (mouseX - followerX) * 0.12;
    followerY += (mouseY - followerY) * 0.12;
    follower.style.left = followerX + 'px';
    follower.style.top  = followerY + 'px';
    requestAnimationFrame(animateFollower);
  }
  animateFollower();

  const hoverTargets = 'a, button, .filter-btn, .project-card, .social-btn, .card-link';
  document.querySelectorAll(hoverTargets).forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('hovering'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('hovering'));
  });

  document.addEventListener('mouseleave', () => {
    cursor.style.opacity = '0';
    follower.style.opacity = '0';
  });

  document.addEventListener('mouseenter', () => {
    cursor.style.opacity = '1';
    follower.style.opacity = '1';
  });
}

/* ── NAVBAR ── */
const nav = document.querySelector('.nav');

if (nav) {
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });
}

/* ── MOBILE NAV ── */
const navToggle = document.getElementById('navToggle');

if (navToggle && nav) {
  navToggle.addEventListener('click', () => {
    nav.classList.toggle('open');
    document.body.style.overflow = nav.classList.contains('open') ? 'hidden' : '';
  });
}

document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    if (nav) nav.classList.remove('open');
    document.body.style.overflow = '';
  });
});

/* ── COUNTER ── */
function easeOutExpo(t) {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

function animateCounter(el) {
  const target = parseInt(el.dataset.count, 10);
  const duration = 1800;
  const start = performance.now();

  function update(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = easeOutExpo(progress);
    el.textContent = Math.round(eased * target) + '+';
    if (progress < 1) requestAnimationFrame(update);
  }

  requestAnimationFrame(update);
}

const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-num[data-count]').forEach(el => {
  counterObserver.observe(el);
});

/* ── REVEAL ── */
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.reveal').forEach(el => {
  revealObserver.observe(el);
});

/* ── SECTION REVEAL ── */
const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.section-header, .about-grid, .filters, .projects-grid, .contact-inner')
        .forEach((el, i) => {
          el.style.transition = `0.8s ease ${i * 80}ms`;
          el.style.opacity = '1';
          el.style.transform = 'translateY(0)';
        });
      sectionObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.about, .projects, .contact').forEach(section => {
  section.querySelectorAll('.section-header, .about-grid, .filters, .projects-grid, .contact-inner')
    .forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(40px)';
    });
  sectionObserver.observe(section);
});

/* ── FILTERS ── */
const filterBtns = document.querySelectorAll('.filter-btn');
const cards = document.querySelectorAll('.project-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;

    cards.forEach((card, i) => {
      const match = filter === 'all' || card.dataset.category === filter;

      if (match) {
        card.classList.remove('hidden');
        setTimeout(() => card.classList.add('visible'), 10);
      } else {
        card.classList.add('hidden');
        card.classList.remove('visible');
      }
    });
  });
});

/* ── CARD 3D ── */
document.querySelectorAll('.card-inner').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `rotateY(${x * 4}deg) rotateX(${-y * 4}deg)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

/* ── GLITCH EFFECT ── */
document.querySelectorAll('.hero-title .line').forEach(line => {
  const original = line.textContent;
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

  line.addEventListener('mouseenter', () => {
    let iter = 0;
    const interval = setInterval(() => {
      line.textContent = original.split('').map((ch, idx) => {
        if (idx < iter) return original[idx];
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

/* ── LOAD ── */
window.addEventListener('load', () => {
  document.body.style.opacity = '1';
});

});