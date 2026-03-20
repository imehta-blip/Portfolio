/* ─── VERB CYCLING in hero tagline ─── */
const verbs = [
  { text: 'Design', color: '#2B4DFF' },
  { text: 'Build',  color: '#F75A0E' },
  { text: 'Ship',   color: '#A9D81B' },
];

let verbIndex = 0;
const verbEl = document.getElementById('verbCycle');

function cycleVerb() {
  if (!verbEl) return;
  // fade out
  verbEl.style.transition = 'opacity 0.35s, transform 0.35s';
  verbEl.style.opacity = '0';
  verbEl.style.transform = 'translateY(-16px)';

  setTimeout(() => {
    verbIndex = (verbIndex + 1) % verbs.length;
    verbEl.textContent = verbs[verbIndex].text;
    verbEl.style.color = verbs[verbIndex].color;
    verbEl.style.transform = 'translateY(16px)';

    // fade in
    requestAnimationFrame(() => {
      verbEl.style.opacity = '1';
      verbEl.style.transform = 'translateY(0)';
    });
  }, 350);
}

// set initial color
if (verbEl) {
  verbEl.style.color = verbs[0].color;
  verbEl.style.fontWeight = '700';
}

setInterval(cycleVerb, 2200);


/* ─── PROJECT CAROUSELS ─── */
document.querySelectorAll('.project-carousel-wrapper').forEach(wrapper => {
  const carousel = wrapper.querySelector('.project-carousel');
  const slides = carousel.querySelectorAll('.carousel-slide');
  const total = slides.length;
  let current = 0;

  function goTo(idx) {
    current = (idx + total) % total;
    carousel.style.transform = `translateX(-${current * 100}%)`;
  }

  wrapper.querySelector('.carousel-btn.prev')?.addEventListener('click', () => goTo(current - 1));
  wrapper.querySelector('.carousel-btn.next')?.addEventListener('click', () => goTo(current + 1));

  // touch/swipe
  let startX = 0;
  carousel.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
  carousel.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 40) goTo(current + (dx < 0 ? 1 : -1));
  });
});

// Fix carousel slide widths on resize
function fixCarouselSizes() {
  document.querySelectorAll('.project-carousel-wrapper').forEach(wrapper => {
    const w = wrapper.offsetWidth;
    wrapper.querySelectorAll('.carousel-slide').forEach(slide => {
      slide.style.width = w + 'px';
    });
    // re-apply current position
    const carousel = wrapper.querySelector('.project-carousel');
    // read current index from transform
    const match = (carousel.style.transform || '').match(/-?([\d.]+)%/);
    if (match) {
      const pct = parseFloat(match[0]);
      // pct is already set correctly as percentage, browser handles it
    }
  });
}

window.addEventListener('resize', fixCarouselSizes);


/* ─── SCROLL REVEAL ─── */
const reveals = document.querySelectorAll('.project-row, .strength-card, .ethos-block');
reveals.forEach(el => el.classList.add('reveal'));

const observer = new IntersectionObserver(entries => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, 80 * i);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

reveals.forEach(el => observer.observe(el));


/* ─── HEADER scroll shadow ─── */
const header = document.querySelector('.header');
window.addEventListener('scroll', () => {
  if (window.scrollY > 10) {
    header.style.boxShadow = '0 2px 20px rgba(0,0,0,0.1)';
  } else {
    header.style.boxShadow = 'none';
  }
}, { passive: true });
