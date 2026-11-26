/**
 * Kits Digitales de Navidad — Interactividad de la Página de Ventas
 * - Carrusel de imágenes con botones (Anterior/Siguiente), puntos y soporte táctil (swipe)
 * - Acordeón de Preguntas Frecuentes accesible
 * - Botones de compra preparados para Hotmart (sin enlaces falsos ni simulación de compra)
 */

document.addEventListener('DOMContentLoaded', () => {
  /* ========================================================================
     1. CARRUSEL DE IMÁGENES (BOTONES + DESLIZAMIENTO CON EL DEDO EN CELULAR)
     ======================================================================== */
  const track = document.querySelector('[data-carousel-track]');
  const slides = Array.from(document.querySelectorAll('[data-carousel-slide]'));
  const prevBtn = document.querySelector('[data-carousel-prev]');
  const nextBtn = document.querySelector('[data-carousel-next]');
  const dots = Array.from(document.querySelectorAll('[data-carousel-dot]'));
  const viewport = document.querySelector('[data-carousel-viewport]');

  if (track && slides.length > 0) {
    let currentIndex = 0;
    const totalSlides = slides.length;

    function goToSlide(index) {
      if (index < 0) {
        currentIndex = totalSlides - 1;
      } else if (index >= totalSlides) {
        currentIndex = 0;
      } else {
        currentIndex = index;
      }

      track.style.transform = `translateX(-${currentIndex * 100}%)`;

      slides.forEach((slide, idx) => {
        slide.setAttribute('aria-hidden', idx !== currentIndex ? 'true' : 'false');
      });

      dots.forEach((dot, idx) => {
        dot.setAttribute('aria-selected', idx === currentIndex ? 'true' : 'false');
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => goToSlide(currentIndex - 1));
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => goToSlide(currentIndex + 1));
    }

    dots.forEach((dot, idx) => {
      dot.addEventListener('click', () => goToSlide(idx));
    });

    // Soporte para deslizar con el dedo en celular (Touch Swipe)
    let touchStartX = 0;
    let touchEndX = 0;
    let isSwiping = false;

    if (viewport) {
      viewport.addEventListener(
        'touchstart',
        (e) => {
          if (e.touches.length === 1) {
            touchStartX = e.touches[0].clientX;
            touchEndX = touchStartX;
            isSwiping = true;
          }
        },
        { passive: true }
      );

      viewport.addEventListener(
        'touchmove',
        (e) => {
          if (!isSwiping || e.touches.length !== 1) return;
          touchEndX = e.touches[0].clientX;
        },
        { passive: true }
      );

      viewport.addEventListener('touchend', () => {
        if (!isSwiping) return;
        const deltaX = touchEndX - touchStartX;
        const swipeThreshold = 42;

        if (deltaX < -swipeThreshold) {
          goToSlide(currentIndex + 1);
        } else if (deltaX > swipeThreshold) {
          goToSlide(currentIndex - 1);
        }
        isSwiping = false;
      });
    }
  }

  /* ========================================================================
     2. ACORDEÓN DE PREGUNTAS FRECUENTES
     ======================================================================== */
  const faqButtons = document.querySelectorAll('.faq-question');

  faqButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const answer = item.querySelector('.faq-answer');
      const isExpanded = btn.getAttribute('aria-expanded') === 'true';

      btn.setAttribute('aria-expanded', !isExpanded ? 'true' : 'false');
      item.classList.toggle('is-open', !isExpanded);

      if (!isExpanded) {
        answer.removeAttribute('hidden');
      } else {
        answer.setAttribute('hidden', '');
      }
    });
  });

  /* ========================================================================
     3. BOTONES DE COMPRA PREPARADOS PARA HOTMART
     Cuando el usuario inserte los enlaces reales en data-hotmart-url="https://...",
     el botón redirigirá automáticamente a Hotmart. Mientras esté vacío, muestra
     un aviso claro sin simular compras ni usar enlaces falsos.
     ======================================================================== */
  const checkoutButtons = document.querySelectorAll('[data-hotmart-checkout]');

  checkoutButtons.forEach((button) => {
    button.addEventListener('click', (event) => {
      const configuredUrl = (button.getAttribute('data-hotmart-url') || '').trim();

      if (configuredUrl && configuredUrl.startsWith('http')) {
        window.location.href = configuredUrl;
        return;
      }

      event.preventDefault();
      const targetId = button.getAttribute('data-feedback-target');
      const feedbackEl = targetId ? document.getElementById(targetId) : null;

      if (feedbackEl) {
        feedbackEl.classList.add('is-visible');
      }
    });
  });
});
