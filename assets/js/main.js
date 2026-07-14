(function () {
  /* ---------- theme toggle ---------- */
  var themeBtn = document.getElementById('theme-toggle');
  themeBtn.addEventListener('click', function () {
    var current = document.documentElement.getAttribute('data-theme');
    var next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('shft-theme', next);
  });

  /* ---------- scroll reveal ---------- */
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var revealEls = document.querySelectorAll('.reveal');
  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(function (el) { io.observe(el); });
  }

  /* ---------- accordion ---------- */
  document.querySelectorAll('.accordion-trigger').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var expanded = btn.getAttribute('aria-expanded') === 'true';
      var panel = btn.closest('.accordion-item').querySelector('.accordion-panel');
      btn.setAttribute('aria-expanded', String(!expanded));
      panel.style.maxHeight = expanded ? '0px' : panel.scrollHeight + 'px';
    });
  });

  window.SHFT_reduceMotion = reduceMotion;

  /* ---------- store promo modal ---------- */
  var modalOverlay = document.getElementById('store-modal-overlay');
  var lastFocused = null;

  function openStoreModal() {
    if (sessionStorage.getItem('shft-store-modal-seen')) return;
    lastFocused = document.activeElement;
    modalOverlay.hidden = false;
    requestAnimationFrame(function () {
      modalOverlay.classList.add('is-open');
      document.getElementById('store-modal-close').focus();
    });
    document.body.style.overflow = 'hidden';
    sessionStorage.setItem('shft-store-modal-seen', '1');
  }

  function closeStoreModal() {
    modalOverlay.classList.remove('is-open');
    document.body.style.overflow = '';
    setTimeout(function () { modalOverlay.hidden = true; }, 350);
    if (lastFocused) lastFocused.focus();
  }

  document.getElementById('store-modal-close').addEventListener('click', closeStoreModal);
  document.getElementById('store-modal-dismiss').addEventListener('click', closeStoreModal);
  modalOverlay.addEventListener('click', function (e) {
    if (e.target === modalOverlay) closeStoreModal();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && modalOverlay.classList.contains('is-open')) closeStoreModal();
  });

  setTimeout(openStoreModal, 1800);

  /* ============================================================
     FIX 1 — Mobile nav dropdown
     The markup/CSS for .nav-mobile-toggle already existed on every
     page, but nothing opened it. This wires it up.
     ============================================================ */
  var navToggle = document.querySelector('.nav-mobile-toggle');
  var navLinks = document.querySelector('.nav-links');

  if (navToggle && navLinks) {
    navToggle.setAttribute('aria-expanded', 'false');

    navToggle.addEventListener('click', function (e) {
      e.stopPropagation();
      var isOpen = navLinks.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });

    navLinks.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        navLinks.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });

    document.addEventListener('click', function (e) {
      if (!navLinks.classList.contains('is-open')) return;
      if (!navLinks.contains(e.target) && e.target !== navToggle) {
        navLinks.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && navLinks.classList.contains('is-open')) {
        navLinks.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.focus();
      }
    });
  }

  /* ============================================================
     FIX 2 — Header search icon
     Same story: the button existed on every page but only the
     calculators directory page had matching logic (added locally
     in directory.js). This makes it work everywhere: on a page
     with a local search box (the calculators directory, or the
     404 page's "try searching" box) it focuses that box; on every
     other page it sends the visitor to the calculator search hub.
     ============================================================ */
  var searchToggle = document.getElementById('site-search-toggle');
  if (searchToggle) {
    searchToggle.addEventListener('click', function () {
      var localSearch = document.getElementById('calc-search') || document.getElementById('notfound-search');
      if (localSearch) {
        localSearch.focus();
        localSearch.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
      } else {
        // main.js is shared across every page at every folder depth, so the
        // relative path to the calculators directory depends on where the
        // current page lives. This checks the current URL rather than
        // hardcoding an absolute path, so it works unmodified whether the
        // site is hosted at a domain root, a GitHub Pages project subpath,
        // or opened from a local folder.
        var path = window.location.pathname;
        var target;
        if (/\/calculators\//.test(path)) {
          target = 'index.html';
        } else if (/\/blog\//.test(path)) {
          target = '../calculators/index.html';
        } else {
          target = 'calculators/index.html';
        }
        window.location.href = target;
      }
    });
  }
})();
