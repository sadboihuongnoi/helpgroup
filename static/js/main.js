(function () {
  // ----- Mobile nav toggle -----
  var navBtn = document.querySelector('.nav-toggle');
  var nav = document.querySelector('.site-nav');
  if (navBtn && nav) {
    navBtn.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      navBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    nav.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        nav.classList.remove('is-open');
        navBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Theme toggle: xử lý ở inline script trong baseof.html (không trùng listener)

  // Publications year filter: xử lý ở inline script trong publications/list.html

  // ----- Counter animation -----
  var counters = document.querySelectorAll('.stat-value[data-counter]');
  if (counters.length && 'IntersectionObserver' in window) {
    var prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    var animate = function (el) {
      var raw = (el.getAttribute('data-counter') || el.textContent || '').trim();
      var match = raw.match(/^(\d+)(.*)$/);
      if (!match) return;
      var target = parseInt(match[1], 10);
      var suffix = match[2];

      if (prefersReduced) {
        el.textContent = target + suffix;
        return;
      }

      var duration = 1200;
      var startTime = null;
      var step = function (t) {
        if (startTime === null) startTime = t;
        var p = Math.min((t - startTime) / duration, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        var current = Math.floor(eased * target);
        el.textContent = current + suffix;
        if (p < 1) requestAnimationFrame(step);
        else el.textContent = target + suffix;
      };
      requestAnimationFrame(step);
    };

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        observer.unobserve(entry.target);
        animate(entry.target);
      });
    }, { threshold: 0.3 });

    counters.forEach(function (el) {
      el.textContent = '0' + (el.getAttribute('data-counter') || '').replace(/^\d+/, '');
      observer.observe(el);
    });
  }
})();
