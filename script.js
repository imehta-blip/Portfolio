/* ─── VERB SEAMLESS LOOP (Design → Build → Ship → Design …) ─── */
// Stack has 4 items: Design, Build, Ship, Design-clone
// Each item = 25% of total height. JS resets instantly after reaching clone.
(function () {
  const scroll = document.getElementById('verbScroll');
  if (!scroll) return;

  const ITEMS   = 4;      // 3 real + 1 Design clone at end
  const STEP    = 100 / ITEMS; // 25% per item
  const PAUSE   = 2000;   // ms each word is shown
  const SLIDE   = 550;    // ms for the slide transition

  let step = 0;

  function advance() {
    step++;
    scroll.style.transition = `transform ${SLIDE}ms ease-in-out`;
    scroll.style.transform  = `translateY(-${step * STEP}%)`;

    // After sliding to the Design clone, instant-reset to real Design
    if (step === ITEMS - 1) {
      setTimeout(() => {
        scroll.style.transition = 'none';
        scroll.style.transform  = 'translateY(0%)';
        step = 0;
      }, SLIDE + 20);
    }
  }

  setInterval(advance, PAUSE + SLIDE);
})();

/* ─── TOOLKIT FAN-OUT on hover (retracts on mouse-leave) ─── */
const toolkitVisual  = document.querySelector('.toolkit-visual');
const toolkitCluster = document.querySelector('.toolkit-img-cluster');

if (toolkitVisual && toolkitCluster) {
  toolkitVisual.addEventListener('mouseenter', () => {
    toolkitCluster.classList.add('toolkit-spread');
  });
  toolkitVisual.addEventListener('mouseleave', () => {
    toolkitCluster.classList.remove('toolkit-spread');
  });
}


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
