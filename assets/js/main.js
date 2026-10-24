/* =========================================================
   HIGH28 / ふたば — main.js
   ========================================================= */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  /* ---------- Mobile nav ---------- */
  var toggle = document.getElementById('navToggle');
  var mobileNav = document.getElementById('mobileNav');
  var iconOpen = document.getElementById('iconOpen');
  var iconClose = document.getElementById('iconClose');

  function setNav(open) {
    if (!mobileNav || !toggle) return;
    mobileNav.classList.toggle('hidden', !open);
    iconOpen.classList.toggle('hidden', open);
    iconClose.classList.toggle('hidden', !open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'メニューを閉じる' : 'メニューを開く');
  }

  if (toggle && mobileNav) {
    toggle.addEventListener('click', function () {
      setNav(mobileNav.classList.contains('hidden'));
    });

    mobileNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () { setNav(false); });
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') setNav(false);
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth >= 768) setNav(false);
    });
  }

  /* ---------- Loader ---------- */
  var loader = document.getElementById('loader');
  var loaderBar = document.getElementById('loaderBar');
  var loaderDone = false;

  function finishLoader() {
    if (loaderDone || !loader) return;
    loaderDone = true;

    if (loaderBar) loaderBar.style.transform = 'scaleX(1)';

    window.setTimeout(function () {
      loader.classList.add('is-done');
      initReveal();
    }, 280);
  }

  window.addEventListener('load', finishLoader);
  window.setTimeout(finishLoader, 2200);

  /* ---------- Scroll progress / header ---------- */
  var progress = document.getElementById('progress');
  var header = document.querySelector('.site-header');
  var ticking = false;

  function onScrollFrame() {
    var doc = document.documentElement;
    var max = doc.scrollHeight - window.innerHeight;
    var y = window.scrollY || doc.scrollTop;

    if (progress) {
      var p = max > 0 ? Math.min(y / max, 1) : 0;
      progress.style.transform = 'scaleX(' + p + ')';
    }

    if (header) header.classList.toggle('is-scrolled', y > 24);

    ticking = false;
  }

  function onScroll() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(onScrollFrame);
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScrollFrame();

  /* ---------- Scroll reveal ---------- */
  var revealEls = document.querySelectorAll('[data-reveal]');
  var revealStarted = false;

  function initReveal() {
    if (revealStarted) return;
    revealStarted = true;

    if (reduceMotion || !('IntersectionObserver' in window)) {
      revealEls.forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });

    revealEls.forEach(function (el) { io.observe(el); });
  }

  // ローダーが何らかの理由で閉じなくてもコンテンツを表示する
  window.setTimeout(initReveal, 1800);

  /* ---------- Custom cursor / parallax / magnetic ---------- */
  var dot = document.querySelector('.cursor-dot');
  var ring = document.querySelector('.cursor-ring');
  var chibi = document.getElementById('chibiParallax');

  var mouseX = window.innerWidth / 2;
  var mouseY = window.innerHeight / 2;
  var ringX = mouseX;
  var ringY = mouseY;
  var tiltX = 0;
  var tiltY = 0;
  var curTiltX = 0;
  var curTiltY = 0;
  var cursorOn = finePointer && !reduceMotion && dot && ring;

  if (cursorOn) {
    document.body.classList.add('has-custom-cursor');

    window.addEventListener('pointermove', function (e) {
      mouseX = e.clientX;
      mouseY = e.clientY;

      document.body.classList.add('is-cursor-active');
      dot.style.transform = 'translate3d(' + mouseX + 'px,' + mouseY + 'px,0)';

      if (chibi) {
        tiltX = (e.clientX / window.innerWidth - 0.5) * 26;
        tiltY = (e.clientY / window.innerHeight - 0.5) * 18;
      }
    }, { passive: true });

    document.querySelectorAll('a, button').forEach(function (el) {
      el.addEventListener('pointerenter', function () { document.body.classList.add('is-hovering'); });
      el.addEventListener('pointerleave', function () { document.body.classList.remove('is-hovering'); });
    });
  }

  if (chibi && finePointer && !reduceMotion) {
    window.addEventListener('pointerleave', function () {
      tiltX = 0;
      tiltY = 0;
    });
  }

  function tick() {
    if (cursorOn) {
      ringX += (mouseX - ringX) * 0.16;
      ringY += (mouseY - ringY) * 0.16;
      ring.style.transform = 'translate3d(' + ringX.toFixed(2) + 'px,' + ringY.toFixed(2) + 'px,0)';
    }

    if (chibi && finePointer && !reduceMotion) {
      curTiltX += (tiltX - curTiltX) * 0.07;
      curTiltY += (tiltY - curTiltY) * 0.07;
      chibi.style.transform = 'translate3d(' + curTiltX.toFixed(2) + 'px,' + curTiltY.toFixed(2) + 'px,0)';
    }

    window.requestAnimationFrame(tick);
  }

  if (!reduceMotion && (cursorOn || (chibi && finePointer))) {
    window.requestAnimationFrame(tick);
  }

  /* ---------- Magnetic buttons ---------- */
  if (finePointer && !reduceMotion) {
    document.querySelectorAll('[data-magnetic]').forEach(function (el) {
      el.addEventListener('pointermove', function (e) {
        var rect = el.getBoundingClientRect();
        var x = (e.clientX - rect.left - rect.width / 2) * 0.22;
        var y = (e.clientY - rect.top - rect.height / 2) * 0.3;
        el.style.transform = 'translate3d(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px,0)';
      });

      el.addEventListener('pointerleave', function () {
        el.style.transform = '';
      });
    });
  }

  /* ---------- Year ---------- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
})();
