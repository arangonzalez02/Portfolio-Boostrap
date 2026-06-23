/* ════════════════════════════════
   scripts.js — JS compartido
   aran · portfolio
════════════════════════════════ */

// Limpiar paddingBottom residual de versiones anteriores
document.body.style.paddingBottom = '';

// Subir botones fijos cuando el footer entra en el viewport
(function () {
  var footer   = document.querySelector('footer');
  var backBtn  = document.querySelector('.page-back-btn');
  var scrollBtn = document.getElementById('scrollTop');
  if (!footer) return;

  var GAP = 12; // px de separación entre botón y footer

  function liftButtons() {
    var footerRect = footer.getBoundingClientRect();
    var viewH = window.innerHeight;
    // Píxeles del footer visibles desde abajo del viewport
    var visible = Math.max(0, viewH - footerRect.top);
    var base = visible + GAP;

    if (backBtn)   backBtn.style.bottom   = base + 'px';
    if (scrollBtn) scrollBtn.style.bottom = base + 'px';
  }

  window.addEventListener('scroll', liftButtons, { passive: true });
  window.addEventListener('resize', liftButtons);
  window.addEventListener('pageshow', liftButtons);
  liftButtons();
})();

// Lightbox modal para imágenes de galerías (elementos cuyo id contiene "galeria")
// Usa event delegation para que funcione aunque el DOM se recree (filtros de proyectos.js)
(function () {
  function createModal() {
    if (document.getElementById('imageModal')) return;
    var div = document.createElement('div');
    div.innerHTML = '<div class="modal fade" id="imageModal" tabindex="-1" aria-hidden="true"><div class="modal-dialog modal-fullscreen"><div class="modal-content bg-transparent border-0"><div class="modal-body d-flex align-items-center justify-content-center p-0"><img id="imageModalImg" src="" alt="" style="max-width:100%;max-height:100%;object-fit:contain;"></div></div></div></div>';
    document.body.appendChild(div.firstElementChild);
  }

  function openModal(src, alt) {
    createModal();
    var modalEl = document.getElementById('imageModal');
    document.getElementById('imageModalImg').src = src;
    document.getElementById('imageModalImg').alt = alt || '';
    new bootstrap.Modal(modalEl).show();

    var floatingId = 'imageModalCloseFloating';
    if (!document.getElementById(floatingId)) {
      var floatBtn = document.createElement('button');
      floatBtn.id = floatingId;
      floatBtn.innerHTML = '✕';
      Object.assign(floatBtn.style, {
        position: 'fixed', top: '12px', right: '12px', zIndex: 2099999999,
        width: '44px', height: '44px', borderRadius: '50%',
        background: 'rgba(0,0,0,0.6)', color: '#fff', border: 'none',
        cursor: 'pointer', display: 'flex', alignItems: 'center',
        justifyContent: 'center', fontSize: '18px'
      });
      floatBtn.addEventListener('click', function () {
        var inst = bootstrap.Modal.getInstance(modalEl);
        if (inst) inst.hide();
      });
      document.body.appendChild(floatBtn);
      modalEl.addEventListener('hidden.bs.modal', function () {
        var fb = document.getElementById(floatingId);
        if (fb && fb.parentNode) fb.parentNode.removeChild(fb);
      });
    }
  }

  // Un único listener delegado en document — sobrevive a cualquier reconstrucción del DOM
  document.addEventListener('click', function (e) {
    var gallery = e.target.closest('[id*="galeria"]');
    if (!gallery) return;
    if (e.target.closest('a, button')) return;

    var card = e.target.closest('.gallery-card');
    if (!card) return;

    var img = e.target.tagName === 'IMG' ? e.target : card.querySelector('img');
    if (!img) return;

    e.preventDefault();
    e.stopPropagation();
    openModal(img.getAttribute('src'), img.getAttribute('alt'));
  });

  // Cursor pointer en cards de galería (accesibilidad visual)
  function setCursors() {
    document.querySelectorAll('[id*="galeria"] .gallery-card').forEach(function (c) {
      c.style.cursor = 'pointer';
    });
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setCursors);
  } else {
    setCursors();
  }
})();

// Botón subir arriba
var st = document.getElementById('scrollTop');
if (st) {
  st.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
  window.addEventListener('scroll', function () {
    st.classList.toggle('visible', window.scrollY > 300);
  });
}

// Animación de entrada en las cards de "What I Do"
(function () {
  var serviceCards = document.querySelectorAll('.service-card');
  if (!serviceCards.length) return;
  var cardObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        var idx = Array.from(serviceCards).indexOf(entry.target);
        setTimeout(function () { entry.target.classList.add('visible'); }, idx * 160);
        cardObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });
  serviceCards.forEach(function (card) { cardObserver.observe(card); });
})();

// Hamburguesa: aria-expanded
(function () {
  var menu = document.getElementById('menu');
  if (!menu) return;

  var openBtns  = document.querySelectorAll('.btn-hamburger[aria-label="Menu"]');
  var closeBtns = document.querySelectorAll('.btn-hamburger[aria-label="Close"]');

  function setExpanded(val) {
    openBtns.forEach(function (b) { b.setAttribute('aria-expanded', val); });
  }

  openBtns.forEach(function (btn) {
    btn.setAttribute('aria-expanded', 'false');
    btn.setAttribute('aria-controls', 'menu');
    btn.addEventListener('click', function () { setExpanded('true'); });
  });

  closeBtns.forEach(function (btn) {
    btn.addEventListener('click', function () { setExpanded('false'); });
  });
})();
