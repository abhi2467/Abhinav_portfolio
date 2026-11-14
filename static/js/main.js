/* =========================================================
   Abhinav Chauhan — Portfolio
   static/js/main.js
   - Theme toggle (light / dark) with localStorage
   - Mobile menu, active nav, back to top
   - Scroll reveal, count-up stats
   - Project filters
   - Certificate lightbox
   - Contact form (mailto, client-side only)
   ========================================================= */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var root = document.documentElement;
  var THEME_KEY = 'abhinav-theme';

  /* ------------------------------------------------------
     1. THEME (light / dark night mode)
     ------------------------------------------------------ */
  function currentTheme() {
    return root.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
  }

  function syncThemeUI() {
    var theme = currentTheme();
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) {
      meta.setAttribute('content', theme === 'light' ? '#f5f4ef' : '#17231f');
    }
    document.querySelectorAll('[data-theme-toggle]').forEach(function (btn) {
      var label = theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode';
      btn.setAttribute('aria-pressed', theme === 'light' ? 'true' : 'false');
      btn.setAttribute('aria-label', label);
      btn.setAttribute('title', label);
    });
  }

  function setTheme(theme) {
    root.setAttribute('data-theme', theme);
    try { localStorage.setItem(THEME_KEY, theme); } catch (e) { /* storage blocked */ }
    syncThemeUI();
  }

  document.querySelectorAll('[data-theme-toggle]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      setTheme(currentTheme() === 'light' ? 'dark' : 'light');
    });
  });
  syncThemeUI();

  /* Follow the OS preference only if the visitor never chose a theme */
  var mq = window.matchMedia('(prefers-color-scheme: light)');
  if (mq.addEventListener) {
    mq.addEventListener('change', function (e) {
      var stored = null;
      try { stored = localStorage.getItem(THEME_KEY); } catch (err) { /* ignore */ }
      if (!stored) {
        root.setAttribute('data-theme', e.matches ? 'light' : 'dark');
        syncThemeUI();
      }
    });
  }

  /* ------------------------------------------------------
     2. FOOTER YEAR
     ------------------------------------------------------ */
  var yearEl = document.getElementById('yr');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ------------------------------------------------------
     3. MOBILE MENU
     ------------------------------------------------------ */
  var burger = document.getElementById('burgerBtn');
  var panel = document.getElementById('mobilePanel');

  function closePanel() {
    if (!panel || !burger) return;
    panel.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
  }

  if (burger && panel) {
    burger.addEventListener('click', function () {
      var open = panel.classList.toggle('open');
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });

    panel.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', closePanel);
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth >= 992) closePanel();
    });
  }

  /* ------------------------------------------------------
     4. ACTIVE NAV LINK ON SCROLL
     ------------------------------------------------------ */
  var sectionIds = ['home', 'projects', 'certificates', 'about', 'contact'];
  var sections = sectionIds
    .map(function (id) { return document.getElementById(id); })
    .filter(Boolean);
  var navlinks = document.querySelectorAll('.navlink');

  function onScrollNav() {
    if (!sections.length) return;
    var pos = window.scrollY + 140;
    var current = sections[0].id;
    sections.forEach(function (s) {
      if (s.offsetTop <= pos) current = s.id;
    });
    navlinks.forEach(function (l) {
      l.classList.toggle('active', l.getAttribute('href') === '#' + current);
    });
  }
  window.addEventListener('scroll', onScrollNav, { passive: true });
  onScrollNav();

  /* ------------------------------------------------------
     5. BACK TO TOP
     ------------------------------------------------------ */
  var toTop = document.getElementById('toTop');
  if (toTop) {
    window.addEventListener('scroll', function () {
      toTop.classList.toggle('show', window.scrollY > 520);
    }, { passive: true });

    toTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    });
  }

  /* ------------------------------------------------------
     6. SCROLL REVEAL
     ------------------------------------------------------ */
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reduceMotion) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in'); });
  }

  /* ------------------------------------------------------
     7. COUNT-UP STATS
     ------------------------------------------------------ */
  function animateCount(el) {
    var target = parseFloat(el.dataset.count);
    if (isNaN(target)) return;
    var suffix = el.dataset.suffix || '';
    var raw = el.dataset.count.indexOf('.') !== -1 ? el.dataset.count.split('.')[1] : '';
    var decimals = raw.length;

    if (reduceMotion) {
      el.textContent = target.toFixed(decimals) + suffix;
      return;
    }

    var duration = 1200;
    var start = performance.now();

    function tick(now) {
      var progress = Math.min((now - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = (target * eased).toFixed(decimals) + suffix;
      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        el.textContent = target.toFixed(decimals) + suffix;
      }
    }
    requestAnimationFrame(tick);
  }

  var counters = document.querySelectorAll('[data-count]');
  if ('IntersectionObserver' in window && !reduceMotion) {
    var co = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          co.unobserve(entry.target);
        }
      });
    }, { threshold: 0.6 });
    counters.forEach(function (el) { co.observe(el); });
  } else {
    counters.forEach(animateCount);
  }

  /* ------------------------------------------------------
     8. PROJECT FILTERS
     ------------------------------------------------------ */
  var filterButtons = document.querySelectorAll('.filter-btn');
  var projectItems = document.querySelectorAll('#projectGrid > [data-tags]');

  filterButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      filterButtons.forEach(function (b) {
        b.classList.remove('active');
        b.setAttribute('aria-pressed', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-pressed', 'true');

      var filter = btn.dataset.filter;
      projectItems.forEach(function (item) {
        var tags = (item.dataset.tags || '').split(/\s+/);
        var show = filter === 'all' || tags.indexOf(filter) !== -1;
        item.classList.toggle('hide', !show);
      });
    });
  });

  /* ------------------------------------------------------
     9. CERTIFICATE LIGHTBOX
     ------------------------------------------------------ */
  var lb = document.getElementById('lightbox');
  var lbImg = document.getElementById('lightboxImg');
  var lbCap = document.getElementById('lightboxCap');
  var lbClose = document.getElementById('lbClose');
  var lastFocus = null;

  function openLightbox(src, title, trigger) {
    if (!lb || !lbImg) return;
    lastFocus = trigger || null;
    lbImg.src = src;
    lbImg.alt = title || 'Certificate';
    if (lbCap) lbCap.textContent = title || '';
    lb.hidden = false;
    document.body.classList.add('no-scroll');
    if (lbClose) lbClose.focus();
  }

  function closeLightbox() {
    if (!lb || lb.hidden) return;
    lb.hidden = true;
    lbImg.src = '';
    document.body.classList.remove('no-scroll');
    if (lastFocus && typeof lastFocus.focus === 'function') lastFocus.focus();
  }

  document.querySelectorAll('.cert-thumb').forEach(function (thumb) {
    thumb.addEventListener('click', function () {
      openLightbox(thumb.dataset.img, thumb.dataset.title, thumb);
    });
  });

  if (lbClose) lbClose.addEventListener('click', closeLightbox);
  if (lb) {
    lb.addEventListener('click', function (e) {
      if (e.target === lb) closeLightbox();
    });
  }
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeLightbox();
  });

  /* ------------------------------------------------------
     10. CONTACT FORM (client-side validation + mailto)
     ------------------------------------------------------ */
  var form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var nameEl = document.getElementById('cName');
      var emailEl = document.getElementById('cEmail');
      var subjectEl = document.getElementById('cSubject');
      var msgEl = document.getElementById('cMsg');
      var note = document.getElementById('formNote');

      var name = (nameEl.value || '').trim();
      var email = (emailEl.value || '').trim();
      var subject = (subjectEl.value || '').trim() || 'Portfolio inquiry';
      var message = (msgEl.value || '').trim();

      var emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

      function fail(text) {
        note.textContent = text;
        note.style.color = 'var(--danger)';
      }

      if (!name || !email || !message) {
        fail('Please fill in your name, email and message.');
        return;
      }
      if (!emailOk) {
        fail('That email address doesn\u2019t look quite right — please check it.');
        return;
      }

      var mailto =
        'mailto:rajputabhinav4163@gmail.com' +
        '?subject=' + encodeURIComponent(subject + ' — from ' + name) +
        '&body=' + encodeURIComponent(message + '\n\nReply to: ' + email);

      window.location.href = mailto;
      note.textContent = 'Opening your email app to send this message…';
      note.style.color = 'var(--accent)';
    });
  }
})();


  /* ------------------------------------------------------
     10. CONTACT FORM (EmailJS Integration)
     ------------------------------------------------------ */

  var form = document.getElementById('contactForm');

  if (form) {

    // EmailJS Configuration
    var EMAILJS_PUBLIC_KEY = 'Um4auskIqmmq97f2I';
    var EMAILJS_SERVICE_ID = 'service_5j65bah';
    var EMAILJS_TEMPLATE_ID = 'template_vi1kj0h';

    // Initialize EmailJS
    if (window.emailjs) {
      window.emailjs.init({
        publicKey: EMAILJS_PUBLIC_KEY
      });
    }

    var nameEl = document.getElementById('cName');
    var emailEl = document.getElementById('cEmail');
    var subjectEl = document.getElementById('cSubject');
    var msgEl = document.getElementById('cMsg');
    var note = document.getElementById('formNote');

    var submitBtn = form.querySelector('button[type="submit"]');

    // Display status message
    function showFormMessage(message, type) {
      if (!note) return;

      note.textContent = message;
      note.style.color = type === 'success'
        ? '#22c55e'
        : type === 'error'
          ? 'var(--danger)'
          : 'var(--accent)';
    }

    // Submit contact form
    form.addEventListener('submit', async function (e) {

      e.preventDefault();

      // Check EmailJS SDK
      if (!window.emailjs) {
        showFormMessage(
          'Email service unavailable. Please refresh the page.',
          'error'
        );
        console.error('EmailJS SDK not loaded.');
        return;
      }

      // Get form values
      var name = nameEl.value.trim();
      var email = emailEl.value.trim();
      var subject = subjectEl.value.trim() || 'Portfolio Inquiry';
      var message = msgEl.value.trim();

      // Validate required fields
      if (!name || !email || !message) {
        showFormMessage(
          'Please fill in your name, email and message.',
          'error'
        );
        return;
      }

      // Validate email
      var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailPattern.test(email)) {
        showFormMessage(
          'Please enter a valid email address.',
          'error'
        );
        emailEl.focus();
        return;
      }

      // Validate message length
      if (
        name.length > 100 ||
        email.length > 254 ||
        subject.length > 150 ||
        message.length > 5000
      ) {
        showFormMessage(
          'Please shorten your message and try again.',
          'error'
        );
        return;
      }

      // Save original button text
      var originalText = submitBtn
        ? submitBtn.innerHTML
        : '';

      // Disable button
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML =
          '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';
      }

      showFormMessage('Sending your message...', 'info');

      try {

        // EmailJS template parameters
        var templateParams = {
          from_name: name,
          reply_to: email,
          subject: subject,
          message: message
        };

        // Send email
        var response = await window.emailjs.send(
          EMAILJS_SERVICE_ID,
          EMAILJS_TEMPLATE_ID,
          templateParams
        );

        console.log('Email sent successfully:', response);

        // Success
        showFormMessage(
          '✓ Message sent successfully! Thank you for contacting me.',
          'success'
        );

        // Reset form
        form.reset();

      } catch (error) {

        // Error handling
        console.error('EmailJS Error:', error);
        console.error('Error details:', error.text || error.message);

        showFormMessage(
          'Unable to send your message. Please try again later.',
          'error'
        );

      } finally {

        // Restore button
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalText;
        }

      }

    });

  }