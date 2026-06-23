/* ════════════════════════════════
   proyectos.js — JS de la galería
   aran · portfolio
════════════════════════════════ */

var mainEl = document.querySelector('main');
var originalMainHTML = mainEl ? mainEl.innerHTML : '';

function revealItems() {
  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry, i) {
      if (entry.isIntersecting) {
        var el = entry.target;
        var delay = (i * 60);
        setTimeout(function() { el.classList.add('revealed'); }, delay);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.gallery-item').forEach(function(item) {
    if (!item.classList.contains('revealed')) {
      observer.observe(item);
    }
  });
}

revealItems();

var filterBtns = document.querySelectorAll('.filter-btn');

// Estado inicial aria-pressed
filterBtns.forEach(function(b) {
  b.setAttribute('aria-pressed', b.classList.contains('active') ? 'true' : 'false');
});

function setActiveFilter(filter) {
  filterBtns.forEach(function(b) {
    var isActive = b.dataset.filter === filter;
    b.classList.toggle('active', isActive);
    b.setAttribute('aria-pressed', isActive ? 'true' : 'false');
  });
}

function applyFilter(filter) {
  setActiveFilter(filter);

  if (filter === 'all') {
    mainEl.innerHTML = originalMainHTML;
    mainEl.scrollIntoView({ behavior: 'smooth' });
    revealItems();
    return;
  }

  // Eliminar mensaje de vacío anterior si existe
  var emptyMsg = document.getElementById('filter-empty');
  if (emptyMsg) emptyMsg.remove();

  // Si venimos de "all" el HTML ya está restaurado; si venimos de otro filtro
  // también, porque siempre partimos del HTML original para cada filtro.
  // Restaurar primero para no acumular DOM roto entre filtros.
  mainEl.innerHTML = originalMainHTML;

  var allRows = mainEl.querySelectorAll('.row');
  var items   = mainEl.querySelectorAll('.gallery-item');

  // Quitar always-on del destacado
  mainEl.querySelectorAll('.gallery-card-overlay.always-on').forEach(function(el) {
    el.classList.remove('always-on');
  });

  // Crear contenedor flex
  var flex = document.createElement('div');
  flex.id = 'all-inline-flex';
  flex.style.cssText = 'display:flex;flex-wrap:wrap;gap:24px;margin:32px auto;padding:0 24px;';
  mainEl.appendChild(flex);

  // Ocultar filas originales
  allRows.forEach(function(row) { row.style.display = 'none'; });

  // Mover los items que coinciden con el filtro al flex
  var matchCount = 0;
  items.forEach(function(item) {
    var cats = item.dataset.cat || '';
    if (!cats.includes(filter)) return;

    matchCount++;
    flex.appendChild(item);
    item.classList.remove(
      'col-12','col-md-7','col-md-5','col-md-4','col-md-8','col-md-3',
      'd-flex','flex-column','border-end','border-dark'
    );
    item.style.cssText = 'flex:1 1 260px;max-width:320px;min-width:220px;margin:0;';

    var card = item.querySelector('.gallery-card');
    if (card) {
      card.classList.remove('h-feat','h-half','h-tall','h-mid','h-sm');
      card.classList.add('h-sm');
    }
  });

  // Estado vacío si no hay resultados
  if (matchCount === 0) {
    var msg = document.createElement('p');
    msg.id = 'filter-empty';
    msg.style.cssText = 'color:#aaa;text-align:center;padding:4rem 1rem;font-size:1rem;width:100%;';
    msg.textContent = 'No projects in this category yet.';
    mainEl.appendChild(msg);
  }

  revealItems();
}

filterBtns.forEach(function(btn) {
  btn.addEventListener('click', function() {
    applyFilter(btn.dataset.filter);
  });
});

// Aplicar filtro desde el query param al cargar la página (?filter=grafico)
(function() {
  var param = new URLSearchParams(window.location.search).get('filter');
  if (param && document.querySelector('[data-filter="' + param + '"]')) {
    applyFilter(param);
  }
})();
