/**
 * DentalVida — Script principal
 * Funcionalidades: Preloader, Navbar, Carruseles, Animaciones scroll,
 *                  Accordeon FAQ, Galería con filtros, Contador stats,
 *                  Formulario, Botón Volver Arriba, Año actual.
 * Versión: 1.0 | Producción
 */

/* ══════════════════════════════════════════════════════════
   1. PRELOADER
══════════════════════════════════════════════════════════ */
(function initPreloader() {
  const preloader = document.getElementById('preloader');
  if (!preloader) return;

  // Ocultar tras la carga de la página (mínimo 1 seg)
  const minTime = new Promise(resolve => setTimeout(resolve, 1000));
  const domReady = new Promise(resolve => {
    if (document.readyState === 'complete') resolve();
    else window.addEventListener('load', resolve, { once: true });
  });

  Promise.all([minTime, domReady]).then(() => {
    preloader.classList.add('hidden');
  });
})();


/* ══════════════════════════════════════════════════════════
   2. NAVBAR — scroll, hamburger, dropdown móvil, overlay
══════════════════════════════════════════════════════════ */
(function initNavbar() {
  const navbar    = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navMenu   = document.getElementById('navMenu');
  if (!navbar) return;

  // Crear overlay para menú móvil
  const overlay = document.createElement('div');
  overlay.className = 'nav-overlay';
  document.body.appendChild(overlay);

  /* ---- Scroll ---- */
  const handleScroll = () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // verificar al cargar

  /* ---- Hamburger ---- */
  function openMenu() {
    navMenu.classList.add('open');
    overlay.classList.add('visible');
    hamburger.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    navMenu.classList.remove('open');
    overlay.classList.remove('visible');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  if (hamburger) {
    hamburger.addEventListener('click', () => {
      if (navMenu.classList.contains('open')) closeMenu();
      else openMenu();
    });
  }

  overlay.addEventListener('click', closeMenu);

  // Cerrar al hacer clic en enlace del menú
  navMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  /* ---- Dropdown móvil: toggle al clic ---- */
  document.querySelectorAll('.has-dropdown').forEach(item => {
    const trigger = item.querySelector('.nav-link');
    if (!trigger) return;

    trigger.addEventListener('click', (e) => {
      // Solo en móvil (menú como panel lateral abierto)
      if (window.innerWidth <= 768) {
        e.preventDefault();
        item.classList.toggle('open');
      }
    });
  });

  /* ---- Smooth scroll para links del navbar ---- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (!target) return;
      e.preventDefault();
      const navHeight = navbar.offsetHeight;
      const top = target.getBoundingClientRect().top + window.scrollY - navHeight - 16;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();


/* ══════════════════════════════════════════════════════════
   3. HERO CAROUSEL
══════════════════════════════════════════════════════════ */
(function initHeroCarousel() {
  const slides   = document.querySelectorAll('#heroCarousel .hero-slide');
  const dots     = document.querySelectorAll('#heroDots .dot');
  const btnPrev  = document.getElementById('heroPrev');
  const btnNext  = document.getElementById('heroNext');
  if (!slides.length) return;

  let current    = 0;
  let autoTimer  = null;
  const DURATION = 5500; // ms

  function goTo(index) {
    slides[current].classList.remove('active');
    dots[current].classList.remove('active');
    current = (index + slides.length) % slides.length;
    slides[current].classList.add('active');
    dots[current].classList.add('active');
  }

  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  function startAuto() {
    clearInterval(autoTimer);
    autoTimer = setInterval(next, DURATION);
  }

  // Eventos de control
  if (btnNext) btnNext.addEventListener('click', () => { next(); startAuto(); });
  if (btnPrev) btnPrev.addEventListener('click', () => { prev(); startAuto(); });

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => { goTo(i); startAuto(); });
  });

  // Swipe táctil
  let touchStartX = 0;
  const carousel = document.getElementById('heroCarousel');
  if (carousel) {
    carousel.addEventListener('touchstart', e => { touchStartX = e.changedTouches[0].clientX; }, { passive: true });
    carousel.addEventListener('touchend', e => {
      const diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) { diff > 0 ? next() : prev(); startAuto(); }
    }, { passive: true });
  }

  // Pausar en hover
  if (carousel) {
    carousel.addEventListener('mouseenter', () => clearInterval(autoTimer));
    carousel.addEventListener('mouseleave', startAuto);
  }

  startAuto();
})();


/* ══════════════════════════════════════════════════════════
   4. TESTIMONIOS CAROUSEL
══════════════════════════════════════════════════════════ */
(function initTestimonialsCarousel() {
  const slides   = document.querySelectorAll('#testimonialsCarousel .testimonial-slide');
  const dots     = document.querySelectorAll('#testDots .dot');
  const btnPrev  = document.getElementById('testPrev');
  const btnNext  = document.getElementById('testNext');
  if (!slides.length) return;

  let current   = 0;
  let autoTimer = null;

  function goTo(index) {
    slides[current].classList.remove('active');
    dots[current].classList.remove('active');
    current = (index + slides.length) % slides.length;
    slides[current].classList.add('active');
    dots[current].classList.add('active');
  }

  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  function startAuto() {
    clearInterval(autoTimer);
    autoTimer = setInterval(next, 6000);
  }

  if (btnNext) btnNext.addEventListener('click', () => { next(); startAuto(); });
  if (btnPrev) btnPrev.addEventListener('click', () => { prev(); startAuto(); });

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => { goTo(i); startAuto(); });
  });

  // Swipe táctil
  const carousel = document.getElementById('testimonialsCarousel');
  if (carousel) {
    let startX = 0;
    carousel.addEventListener('touchstart', e => { startX = e.changedTouches[0].clientX; }, { passive: true });
    carousel.addEventListener('touchend', e => {
      const diff = startX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) { diff > 0 ? next() : prev(); startAuto(); }
    }, { passive: true });
  }

  startAuto();
})();


/* ══════════════════════════════════════════════════════════
   5. ANIMACIONES DE SCROLL (IntersectionObserver)
══════════════════════════════════════════════════════════ */
(function initScrollAnimations() {
  const animElements = document.querySelectorAll(
    '.animate-left, .animate-right, .animate-up'
  );
  if (!animElements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          // Dejar de observar una vez animado
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
  );

  animElements.forEach(el => observer.observe(el));
})();


/* ══════════════════════════════════════════════════════════
   6. CONTADOR ESTADÍSTICAS (Hero Stats)
══════════════════════════════════════════════════════════ */
(function initCounters() {
  const counters = document.querySelectorAll('.stat-number[data-count]');
  if (!counters.length) return;

  const formatNumber = (n) => {
    if (n >= 1000) return n.toLocaleString('es-MX');
    return n.toString();
  };

  const animateCounter = (el) => {
    const target    = parseInt(el.getAttribute('data-count'), 10);
    const duration  = 1800; // ms
    const startTime = performance.now();

    const update = (now) => {
      const elapsed  = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Easing: easeOutQuart
      const ease = 1 - Math.pow(1 - progress, 4);
      const current = Math.round(ease * target);
      el.textContent = formatNumber(current);
      if (progress < 1) requestAnimationFrame(update);
    };

    requestAnimationFrame(update);
  };

  // Activar cuando el hero-stats sea visible
  const statsBar = document.querySelector('.hero-stats');
  if (!statsBar) return;

  let counted = false;
  const obs = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !counted) {
      counted = true;
      counters.forEach(c => animateCounter(c));
      obs.disconnect();
    }
  }, { threshold: 0.5 });

  obs.observe(statsBar);
})();


/* ══════════════════════════════════════════════════════════
   7. ACCORDION FAQ
══════════════════════════════════════════════════════════ */
(function initAccordion() {
  const items = document.querySelectorAll('.accordion-item');
  if (!items.length) return;

  items.forEach(item => {
    const btn  = item.querySelector('.accordion-header');
    const body = item.querySelector('.accordion-body');
    if (!btn || !body) return;

    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      // Cerrar todos
      items.forEach(i => {
        i.classList.remove('open');
        const b = i.querySelector('.accordion-header');
        if (b) b.setAttribute('aria-expanded', 'false');
      });

      // Abrir el clicado si estaba cerrado
      if (!isOpen) {
        item.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });
})();


/* ══════════════════════════════════════════════════════════
   8. GALERÍA — FILTROS
══════════════════════════════════════════════════════════ */
(function initGalleryFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const items      = document.querySelectorAll('.gallery-item');
  if (!filterBtns.length || !items.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-filter');

      // Actualizar botones
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Filtrar items con animación
      items.forEach(item => {
        const cat = item.getAttribute('data-category');
        if (filter === 'all' || cat === filter) {
          item.classList.remove('hidden');
          // Pequeña animación al aparecer
          item.style.animation = 'none';
          requestAnimationFrame(() => {
            item.style.animation = '';
          });
        } else {
          item.classList.add('hidden');
        }
      });
    });
  });
})();


/* ══════════════════════════════════════════════════════════
   9. FORMULARIO DE CONTACTO
══════════════════════════════════════════════════════════ */
(function initContactForm() {
  const form    = document.getElementById('contactForm');
  const success = document.getElementById('formSuccess');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Validación básica
    const nombre   = form.querySelector('#nombre');
    const telefono = form.querySelector('#telefono');
    const email    = form.querySelector('#email');
    let valid = true;

    [nombre, telefono, email].forEach(field => {
      if (!field || !field.value.trim()) {
        field.style.borderColor = '#EF4444';
        valid = false;
        // Resetear borde tras 2s
        setTimeout(() => { field.style.borderColor = ''; }, 2000);
      }
    });

    if (!valid) return;

    // Simular envío (reemplazar con fetch real a tu backend/EmailJS/etc.)
    const btn = form.querySelector('button[type="submit"]');
    const originalContent = btn.innerHTML;

    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Enviando...';

    setTimeout(() => {
      btn.innerHTML = originalContent;
      btn.disabled = false;
      form.reset();
      if (success) {
        success.classList.add('visible');
        setTimeout(() => success.classList.remove('visible'), 5000);
      }
    }, 1500);
  });
})();


/* ══════════════════════════════════════════════════════════
   10. BOTÓN VOLVER ARRIBA
══════════════════════════════════════════════════════════ */
(function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) btn.classList.add('visible');
    else btn.classList.remove('visible');
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();


/* ══════════════════════════════════════════════════════════
   11. AÑO DINÁMICO EN FOOTER
══════════════════════════════════════════════════════════ */
(function setCurrentYear() {
  const el = document.getElementById('currentYear');
  if (el) el.textContent = new Date().getFullYear();
})();


/* ══════════════════════════════════════════════════════════
   12. ACTIVE LINK EN NAVBAR según scroll
══════════════════════════════════════════════════════════ */
(function initActiveSections() {
  const sections = document.querySelectorAll('section[id], div[id]');
  const navLinks = document.querySelectorAll('#navMenu .nav-link');
  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach(link => {
            link.classList.remove('nav-active');
            if (link.getAttribute('href') === `#${id}`) {
              link.classList.add('nav-active');
            }
          });
        }
      });
    },
    { threshold: 0.35, rootMargin: '-80px 0px -35% 0px' }
  );

  sections.forEach(section => observer.observe(section));
})();
