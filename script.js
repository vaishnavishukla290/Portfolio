// Smooth scrolling with Lenis (guarded, with graceful fallback)
let lenis;
try {
  if (window.Lenis) {
    lenis = new Lenis({
      lerp: 0.08,
      wheelMultiplier: 0.9,
      smoothWheel: true,
      smoothTouch: false
    });
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Keep GSAP ScrollTrigger in sync (optional but nice)
    if (window.ScrollTrigger) {
      lenis.on('scroll', ScrollTrigger.update);
    }
  } else {
    console.warn('Lenis not found on window. Falling back to native smooth scroll.');
  }
} catch (err) {
  console.warn('Failed to initialize Lenis. Falling back.', err);
}

// Year in footer
document.getElementById('year').textContent = new Date().getFullYear();

// Mobile menu toggle
const burger = document.querySelector('.nav__burger');
const menu = document.querySelector('.menu');
burger?.addEventListener('click', () => {
  menu.style.display = menu.style.display === 'flex' ? 'none' : 'flex';
});

// GSAP Animations
gsap.registerPlugin(ScrollTrigger);

// Split lines for hero title animation
const splitLines = document.querySelectorAll('.split');
splitLines.forEach(el => {
  const words = el.textContent.trim().split(' ');
  el.innerHTML = words.map(w => `<span class="line-word" style="display:inline-block; transform: translateY(30px); opacity:0">${w}&nbsp;</span>`).join('');
});

window.addEventListener('load', () => {
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
  tl.from('.nav', { y: -30, opacity: 0, duration: 0.6 })
    .to('.eyebrow', { y: 0, opacity: 1, duration: 0.5 }, '-=0.2')
    .to('.split .line-word', { y: 0, opacity: 1, duration: 0.7, stagger: 0.03 }, '-=0.1')
    .to('.hero__lead', { y: 0, opacity: 1, duration: 0.6 }, '-=0.3')
    .to('.hero__cta', { y: 0, opacity: 1, duration: 0.6 }, '-=0.4')
    .to('.socials', { y: 0, opacity: 1, duration: 0.6 }, '-=0.5')
    .to('.hero__visual', { y: 0, opacity: 1, duration: 0.7 }, '-=0.4');
});

// Reveal on scroll
gsap.utils.toArray('.reveal').forEach((el) => {
  gsap.to(el, {
    scrollTrigger: {
      trigger: el,
      start: 'top 85%',
    },
    y: 0,
    opacity: 1,
    duration: 0.8,
    ease: 'power3.out'
  });
});

// Timeline slight stagger
gsap.utils.toArray('.timeline__item').forEach((item, i) => {
  gsap.fromTo(item, { y: 20, opacity: 0 }, {
    scrollTrigger: { trigger: item, start: 'top 85%' },
    y: 0, opacity: 1, duration: 0.7, delay: i * 0.05
  });
});

// Magnetic buttons
const magnets = document.querySelectorAll('.magnetic');
const strength = 20;
magnets.forEach((el) => {
  el.addEventListener('mousemove', (e) => {
    const rect = el.getBoundingClientRect();
    const relX = e.clientX - rect.left - rect.width / 2;
    const relY = e.clientY - rect.top - rect.height / 2;
    el.style.transform = `translate(${(relX / rect.width) * strength}px, ${(relY / rect.height) * strength}px)`;
  });
  el.addEventListener('mouseleave', () => {
    el.style.transform = `translate(0,0)`;
  });
});

// VanillaTilt for project cards
VanillaTilt.init(document.querySelectorAll(".tilt"), {
  max: 8,
  speed: 400,
  glare: true,
  "max-glare": 0.15,
  gyroscope: true
});

// Scroll to top with fallback
document.querySelector('.to-top')?.addEventListener('click', (e) => {
  e.preventDefault();
  if (lenis) {
    lenis.scrollTo('#hero', { offset: 0, duration: 1.0, easing: (t) => 1 - Math.pow(1 - t, 3) });
  } else {
    document.getElementById('hero')?.scrollIntoView({ behavior: 'smooth' });
  }
});