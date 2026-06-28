/* ============================================================
   Deepak Sahu Portfolio — main.js
   All interactions: cursor, scroll, typing, AOS, counters, etc.
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── 1. LOADER ── */
  const loader = document.getElementById('loader');
  setTimeout(() => {
    loader.classList.add('hidden');
    document.body.style.overflow = '';
    // Trigger AOS after loader
    setTimeout(initAOS, 300);
  }, 2000);
  document.body.style.overflow = 'hidden';


  /* ── 2. CUSTOM CURSOR ── */
  const cursor = document.getElementById('cursor');
  const follower = document.getElementById('cursor-follower');
  let mouseX = 0, mouseY = 0;
  let followerX = 0, followerY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top = mouseY + 'px';
  });

  // Smooth follower
  function animateFollower() {
    followerX += (mouseX - followerX) * 0.12;
    followerY += (mouseY - followerY) * 0.12;
    follower.style.left = followerX + 'px';
    follower.style.top = followerY + 'px';
    requestAnimationFrame(animateFollower);
  }
  animateFollower();

  // Hover effect on interactive elements
  const hoverEls = document.querySelectorAll('a, button, .btn, .glass-card, .project-card, .skill-tag');
  hoverEls.forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.classList.add('cursor-hover');
      follower.classList.add('cursor-hover');
    });
    el.addEventListener('mouseleave', () => {
      cursor.classList.remove('cursor-hover');
      follower.classList.remove('cursor-hover');
    });
  });

  // Hide cursor when leaving window
  document.addEventListener('mouseleave', () => { cursor.style.opacity = '0'; follower.style.opacity = '0'; });
  document.addEventListener('mouseenter', () => { cursor.style.opacity = '1'; follower.style.opacity = '0.5'; });


  /* ── 3. SCROLL PROGRESS ── */
  const progress = document.getElementById('scroll-progress');
  window.addEventListener('scroll', () => {
    const total = document.documentElement.scrollHeight - window.innerHeight;
    const pct = (window.scrollY / total) * 100;
    progress.style.width = pct + '%';
  }, { passive: true });


  /* ── 4. NAVBAR ── */
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-links a');

  window.addEventListener('scroll', () => {
    // Scrolled state
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Active section highlight
    const sections = document.querySelectorAll('section[id]');
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
    });
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) link.classList.add('active');
    });
  }, { passive: true });

  // Smooth scroll for nav links
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href === '#') return;
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
        // Close mobile menu if open
        mobileMenu.classList.remove('open');
        hamburger.classList.remove('active');
      }
    });
  });

  // Mobile menu
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    mobileMenu.classList.toggle('open');
  });


  /* ── 5. THEME TOGGLE ── */
  const themeToggle = document.getElementById('theme-toggle');
  const root = document.documentElement;

  // Check saved preference
  const savedTheme = localStorage.getItem('theme') || 'dark';
  root.setAttribute('data-theme', savedTheme);

  themeToggle.addEventListener('click', () => {
    const current = root.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
  });


  /* ── 6. TYPING ANIMATION ── */
  const typedEl = document.getElementById('typed-text');
  const phrases = [
    'Java Full Stack Developer',
    'Spring Boot Engineer',
    'Microservices Architect',
    'REST API Specialist',
    'AWS Cloud Developer',
  ];
  let phraseIdx = 0;
  let charIdx = 0;
  let deleting = false;

  function type() {
    const current = phrases[phraseIdx];
    if (deleting) {
      typedEl.textContent = current.slice(0, charIdx--);
      if (charIdx < 0) {
        deleting = false;
        phraseIdx = (phraseIdx + 1) % phrases.length;
        setTimeout(type, 400);
        return;
      }
    } else {
      typedEl.textContent = current.slice(0, ++charIdx);
      if (charIdx === current.length) {
        setTimeout(() => { deleting = true; type(); }, 2000);
        return;
      }
    }
    setTimeout(type, deleting ? 40 : 80);
  }
  setTimeout(type, 1500);


  /* ── 7. ANIMATED COUNTERS ── */
  function animateCounter(el, target, suffix = '') {
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;
    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        el.textContent = target + suffix;
        clearInterval(timer);
      } else {
        el.textContent = Math.floor(current) + suffix;
      }
    }, 16);
  }

  // Counter observer
  const counterEls = document.querySelectorAll('[data-counter]');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.dataset.counted) {
        entry.target.dataset.counted = 'true';
        const target = parseInt(entry.target.dataset.counter);
        const suffix = entry.target.dataset.suffix || '';
        animateCounter(entry.target, target, suffix);
      }
    });
  }, { threshold: 0.5 });

  counterEls.forEach(el => counterObserver.observe(el));


  /* ── 8. AOS SCROLL ANIMATION ── */
  function initAOS() {
    const aosEls = document.querySelectorAll('[data-aos]');
    const aosObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const delay = entry.target.dataset.aosDelay || 0;
          setTimeout(() => {
            entry.target.classList.add('aos-animate');
          }, parseInt(delay));
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

    aosEls.forEach(el => aosObserver.observe(el));
  }


  /* ── 9. BACK TO TOP ── */
  const backToTop = document.getElementById('back-to-top');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
  }, { passive: true });

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });


  /* ── 10. CONTACT FORM ── */
  const contactForm = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      submitBtn.textContent = 'Sending...';
      submitBtn.disabled = true;

      // EmailJS integration (configure your keys)
      const name = document.getElementById('contact-name').value;
      const email = document.getElementById('contact-email').value;
      const phone = document.getElementById('contact-phone').value;
      const subject = document.getElementById('contact-subject').value;
      const message = document.getElementById('contact-message').value;

      // Using EmailJS — set your SERVICE_ID, TEMPLATE_ID, PUBLIC_KEY in config
      if (typeof emailjs !== 'undefined' && window.EMAILJS_CONFIG) {
        emailjs.send(
          window.EMAILJS_CONFIG.serviceId,
          window.EMAILJS_CONFIG.templateId,
          { from_name: name, from_email: email, phone, subject, message }
        ).then(() => {
          formStatus.textContent = '✓ Message sent successfully! I\'ll get back to you soon.';
          formStatus.className = 'success';
          contactForm.reset();
        }).catch(() => {
          formStatus.textContent = '✕ Failed to send. Please try WhatsApp or email directly.';
          formStatus.className = 'error';
        }).finally(() => {
          submitBtn.textContent = 'Send Email';
          submitBtn.disabled = false;
        });
      } else {
        // Fallback: open mailto
        const body = `Name: ${name}\nPhone: ${phone}\n\n${message}`;
        window.location.href = `mailto:deepak.sahu@email.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        formStatus.textContent = '✓ Opening your email client...';
        formStatus.className = 'success';
        submitBtn.textContent = 'Send Email';
        submitBtn.disabled = false;
      }
    });
  }

  // WhatsApp button
  const waBtn = document.getElementById('whatsapp-send');
  if (waBtn) {
    waBtn.addEventListener('click', () => {
      const name = document.getElementById('contact-name').value || 'Visitor';
      const subject = document.getElementById('contact-subject').value || 'Portfolio Inquiry';
      const message = document.getElementById('contact-message').value || 'Hi Deepak, I came across your portfolio and would like to connect!';
      const text = `Hi Deepak! I'm ${name}.\n*Subject:* ${subject}\n\n${message}`;
      window.open(`https://wa.me/919XXXXXXXXX?text=${encodeURIComponent(text)}`, '_blank');
    });
  }


  /* ── 11. SKILL TAG HOVER GLOW ── */
  document.querySelectorAll('.skill-tag').forEach(tag => {
    tag.addEventListener('mouseenter', function() {
      this.style.boxShadow = `0 0 12px var(--accent-1)`;
    });
    tag.addEventListener('mouseleave', function() {
      this.style.boxShadow = 'none';
    });
  });


  /* ── 12. SECTION REVEAL POLISH ── */
  // Re-check hover elements dynamically (since cards may be animated in)
  document.querySelectorAll('.glass-card, .project-card, .service-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
      cursor.classList.add('cursor-hover');
      follower.classList.add('cursor-hover');
    });
    card.addEventListener('mouseleave', () => {
      cursor.classList.remove('cursor-hover');
      follower.classList.remove('cursor-hover');
    });
  });

});
