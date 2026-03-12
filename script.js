const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');
const navAnchors = document.querySelectorAll('.nav-links a');

if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  navAnchors.forEach((link) => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

const revealElements = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.18 }
);

revealElements.forEach((el) => revealObserver.observe(el));

const metrics = document.querySelectorAll('.metric');
const countObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      const metric = entry.target;
      const target = Number(metric.dataset.target || 0);
      const duration = 1400;
      const startTime = performance.now();

      const updateCount = (now) => {
        const progress = Math.min((now - startTime) / duration, 1);
        const current = Math.floor(progress * target);
        metric.textContent = current.toLocaleString();

        if (progress < 1) {
          requestAnimationFrame(updateCount);
        }
      };

      requestAnimationFrame(updateCount);
      observer.unobserve(metric);
    });
  },
  { threshold: 0.35 }
);

metrics.forEach((metric) => countObserver.observe(metric));

// Lightweight chart rendering for the market placeholder.
const canvas = document.getElementById('marketChart');
if (canvas) {
  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;

  const drawChart = () => {
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    ctx.clearRect(0, 0, width, height);

    ctx.strokeStyle = 'rgba(157, 184, 208, 0.22)';
    ctx.lineWidth = 1;
    for (let i = 1; i < 6; i += 1) {
      const y = (height / 6) * i;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    const points = [0.08, 0.21, 0.18, 0.3, 0.42, 0.39, 0.56, 0.67, 0.62, 0.74, 0.9];
    ctx.beginPath();
    points.forEach((val, index) => {
      const x = (width / (points.length - 1)) * index;
      const y = height - val * (height - 24) - 12;
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });

    ctx.strokeStyle = '#29d3a5';
    ctx.lineWidth = 2.5;
    ctx.shadowColor = 'rgba(41, 211, 165, 0.35)';
    ctx.shadowBlur = 12;
    ctx.stroke();
    ctx.shadowBlur = 0;
  };

  drawChart();
  window.addEventListener('resize', drawChart);
}

const contactForm = document.getElementById('contactForm');
const formMessage = document.getElementById('formMessage');

if (contactForm && formMessage) {
  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const data = new FormData(contactForm);
    const name = String(data.get('name') || '').trim();
    const email = String(data.get('email') || '').trim();
    const phone = String(data.get('phone') || '').trim();
    const message = String(data.get('message') || '').trim();

    if (!name || !email || !phone || !message) {
      formMessage.textContent = 'Please fill in all fields before submitting.';
      formMessage.style.color = '#ff6b6b';
      return;
    }

    formMessage.textContent = 'Thank you. Your message has been captured successfully.';
    formMessage.style.color = '#29d3a5';
    contactForm.reset();
  });
}

const yearElement = document.getElementById('year');
if (yearElement) {
  yearElement.textContent = String(new Date().getFullYear());
}
