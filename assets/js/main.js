/* Matan Shneor — site behaviour (shared by every page) */
(function () {
  'use strict';

  var root = document.documentElement;
  var WA_NUMBER = '972542165560';
  var WA_TEXT = {
    en: 'Hi Matan, I saw your website and would like to talk.',
    he: 'היי מתן, הגעתי מהאתר שלך ואשמח לדבר.'
  };

  /* ─── Language ─────────────────────────────────────────────────────────── */
  function store(lang) {
    try { localStorage.setItem('lang', lang); } catch (e) { /* storage unavailable */ }
  }

  function applyLang(lang) {
    root.lang = lang;
    root.dir = lang === 'he' ? 'rtl' : 'ltr';

    var title = root.getAttribute('data-title-' + lang);
    if (title) document.title = title;
    var desc = root.getAttribute('data-desc-' + lang);
    var meta = document.querySelector('meta[name="description"]');
    if (desc && meta) meta.setAttribute('content', desc);

    document.querySelectorAll('[data-aria-' + lang + ']').forEach(function (el) {
      el.setAttribute('aria-label', el.getAttribute('data-aria-' + lang));
    });
    document.querySelectorAll('[data-alt-' + lang + ']').forEach(function (el) {
      el.setAttribute('alt', el.getAttribute('data-alt-' + lang));
    });

    var waHref = 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(WA_TEXT[lang]);
    document.querySelectorAll('[data-wa]').forEach(function (a) { a.setAttribute('href', waHref); });

    document.querySelectorAll('.lang-toggle').forEach(function (b) {
      var toHe = lang !== 'he';
      b.setAttribute('aria-label', toHe ? 'החלפה לעברית' : 'Switch to English');
      b.setAttribute('lang', toHe ? 'he' : 'en');
    });
  }

  function toggleLang() {
    var next = root.lang === 'he' ? 'en' : 'he';
    applyLang(next);
    store(next);
    try {
      var url = new URL(window.location.href);
      if (url.searchParams.has('lang')) {
        url.searchParams.set('lang', next);
        history.replaceState(null, '', url);
      }
    } catch (e) { /* old browser */ }
  }

  applyLang(root.lang === 'he' ? 'he' : 'en');
  document.querySelectorAll('.lang-toggle').forEach(function (b) {
    b.addEventListener('click', toggleLang);
  });

  /* ─── Navigation ───────────────────────────────────────────────────────── */
  var nav = document.querySelector('.nav');
  var burger = document.querySelector('.nav-burger');
  var drawer = document.getElementById('drawer');

  function onScroll() {
    var y = window.scrollY;
    if (nav) nav.classList.toggle('is-scrolled', y > 40);
    if (waFloat) waFloat.classList.toggle('is-visible', y > window.innerHeight * 0.6);
  }

  function setDrawer(open, returnFocus) {
    if (!drawer || !burger) return;
    var wasOpen = drawer.classList.contains('is-open');
    drawer.classList.toggle('is-open', open);
    burger.setAttribute('aria-expanded', String(open));
    if (!open && wasOpen && returnFocus) burger.focus();
  }
  if (burger) {
    burger.addEventListener('click', function (e) {
      e.stopPropagation();
      setDrawer(burger.getAttribute('aria-expanded') !== 'true');
    });
  }
  if (drawer) {
    drawer.addEventListener('click', function (e) {
      if (e.target.closest('a')) setDrawer(false, false);
    });
  }
  document.addEventListener('click', function (e) {
    if (drawer && drawer.classList.contains('is-open') && !drawer.contains(e.target)) setDrawer(false);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') setDrawer(false, true);
  });

  /* Active section in the nav */
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav-links a[href^="#"]'));
  if (navLinks.length && 'IntersectionObserver' in window) {
    var byId = {};
    navLinks.forEach(function (a) { byId[a.getAttribute('href').slice(1)] = a; });
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var link = byId[entry.target.id];
        if (!link) return;
        if (entry.isIntersecting) {
          navLinks.forEach(function (a) { a.removeAttribute('aria-current'); });
          link.setAttribute('aria-current', 'location');
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    Object.keys(byId).forEach(function (id) {
      var s = document.getElementById(id);
      if (s) spy.observe(s);
    });
  }

  /* ─── WhatsApp floating button ─────────────────────────────────────────── */
  var waFloat = document.querySelector('.wa-float');
  var ticking = false;
  window.addEventListener('scroll', function () {
    if (!ticking) {
      window.requestAnimationFrame(function () { onScroll(); ticking = false; });
      ticking = true;
    }
  }, { passive: true });
  onScroll();

  /* ─── Reveal on scroll ─────────────────────────────────────────────────── */
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reduceMotion) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('is-in'); });
  }

  /* ─── Career chart (hero) ──────────────────────────────────────────────── */
  var career = document.querySelector('.career');
  if (career) {
    window.requestAnimationFrame(function () {
      window.setTimeout(function () { career.classList.add('is-drawn'); }, reduceMotion ? 0 : 120);
    });
    /* Milestones fade in as the line reaches them */
    career.querySelectorAll('.milestone').forEach(function (m) {
      var x = parseFloat(m.style.left) || 0;
      m.style.transitionDelay = reduceMotion ? '0ms' : (350 + x * 21) + 'ms';
    });
  }

  /* ─── Count-up numbers ─────────────────────────────────────────────────── */
  var counters = document.querySelectorAll('[data-count]');
  function runCount(el) {
    var target = parseFloat(el.getAttribute('data-count'));
    if (reduceMotion || !target) { el.textContent = String(target); return; }
    var start = null;
    var dur = 1300;
    function step(ts) {
      if (start === null) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = String(Math.round(target * eased));
      if (p < 1) window.requestAnimationFrame(step);
    }
    window.requestAnimationFrame(step);
  }
  if (counters.length && 'IntersectionObserver' in window) {
    var co = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { runCount(entry.target); co.unobserve(entry.target); }
      });
    }, { threshold: 0.6 });
    counters.forEach(function (el) { co.observe(el); });
  }

  /* ─── Work filters ─────────────────────────────────────────────────────── */
  var filters = document.querySelectorAll('.filter');
  var cards = document.querySelectorAll('.work-card');
  var workStatus = document.getElementById('work-status');
  filters.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var f = btn.getAttribute('data-filter');
      filters.forEach(function (b) { b.setAttribute('aria-pressed', String(b === btn)); });
      cards.forEach(function (card) {
        var cats = (card.getAttribute('data-cat') || '').split(' ');
        var show = f === 'all' || cats.indexOf(f) !== -1;
        card.classList.toggle('is-hidden', !show);
        if (show) card.classList.add('is-in');
      });
      if (workStatus) {
        var n = document.querySelectorAll('.work-card:not(.is-hidden)').length;
        workStatus.textContent = root.lang === 'he' ? 'מוצגים ' + n + ' פרויקטים' : 'Showing ' + n + ' projects';
      }
    });
  });

  /* ─── Footer year ──────────────────────────────────────────────────────── */
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = String(new Date().getFullYear());
  });
})();
