/* Educate Ohio — shared interactions: reveal, count-up, sticky bar, parallax */
(function () {
  'use strict';
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion:reduce)').matches;

  /* --- sticky top bar: solidify after the hero (only when a hero exists) --- */
  var bar = document.getElementById('topbar');
  var hero = document.querySelector('.hero');
  if (bar && hero && !bar.classList.contains('static')) {
    var onScroll = function () {
      bar.classList.toggle('solid', window.scrollY > window.innerHeight * 0.8 - 70);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* --- reveal on scroll (never hide anything unless we can observe it) --- */
  if (!reduce && 'IntersectionObserver' in window) {
    document.documentElement.classList.add('js');
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.12 });
    document.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });
  }

  /* --- count-up for [data-count] once it scrolls into view --- */
  function countUp(el) {
    var target = parseInt(el.getAttribute('data-count'), 10);
    if (reduce) { el.firstChild.nodeValue = target; return; }
    var start = null, dur = 1100;
    function frame(t) {
      if (!start) start = t;
      var p = Math.min((t - start) / dur, 1);
      el.firstChild.nodeValue = Math.round((1 - Math.pow(1 - p, 3)) * target);
      if (p < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }
  var counters = document.querySelectorAll('[data-count]');
  if (counters.length && 'IntersectionObserver' in window) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { countUp(e.target); cio.unobserve(e.target); }
      });
    }, { threshold: 0.5 });
    counters.forEach(function (el) { cio.observe(el); });
  } else {
    counters.forEach(function (el) { el.firstChild.nodeValue = el.getAttribute('data-count'); });
  }

  /* --- sign-up: enhance Netlify form with inline success (still works without JS) --- */
  var form = document.getElementById('getform');
  var msg = document.getElementById('formMsg');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var data = new FormData(form);
      var body = new URLSearchParams(data).toString();
      fetch('/', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: body })
        .then(function () {
          form.querySelector('.frow').hidden = true;
          form.querySelector('.frow2').hidden = true;
          var fine = form.querySelector('.fine'); if (fine) fine.hidden = true;
          if (msg) msg.classList.add('show');
        })
        .catch(function () {
          if (msg) { msg.textContent = 'Something went wrong — please try again.'; msg.classList.add('show'); }
        });
    });
  }

  /* --- lightweight parallax on [data-parallax] (skip on touch / reduced motion) --- */
  var isTouch = window.matchMedia && window.matchMedia('(hover:none)').matches;
  if (!reduce && !isTouch) {
    var items = [].slice.call(document.querySelectorAll('[data-parallax]'));
    if (items.length) {
      var ticking = false;
      var update = function () {
        var vh = window.innerHeight;
        items.forEach(function (el) {
          var r = el.getBoundingClientRect();
          if (r.bottom < 0 || r.top > vh) return;
          var speed = parseFloat(el.getAttribute('data-parallax')) || 0.12;
          var center = r.top + r.height / 2 - vh / 2;
          el.style.transform = 'translateY(' + (-center * speed).toFixed(1) + 'px) scale(1.12)';
        });
        ticking = false;
      };
      var req = function () { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
      window.addEventListener('scroll', req, { passive: true });
      window.addEventListener('resize', req, { passive: true });
      update();
    }
  }
})();
