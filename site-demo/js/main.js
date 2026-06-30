'use strict';

/* ==========================================================
   ESCOLA FELIPE MAGALHÃES — JavaScript principal
========================================================== */

/* ----------------------------------------------------------
   1. HEADER: adiciona classe .scrolled ao rolar
---------------------------------------------------------- */
const header = document.getElementById('site-header');

function onScroll() {
  header.classList.toggle('scrolled', window.scrollY > 60);
}
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

/* ----------------------------------------------------------
   2. MENU MOBILE: toggle hambúrguer
---------------------------------------------------------- */
const menuBtn    = document.getElementById('menu-btn');
const mobileMenu = document.getElementById('mobile-menu');

function closeMobileMenu() {
  mobileMenu.classList.remove('open');
  menuBtn.classList.remove('active');
  menuBtn.setAttribute('aria-expanded', 'false');
}

menuBtn.addEventListener('click', function () {
  const opening = !mobileMenu.classList.contains('open');
  mobileMenu.classList.toggle('open', opening);
  menuBtn.classList.toggle('active', opening);
  menuBtn.setAttribute('aria-expanded', String(opening));
});

// Fechar ao clicar fora do menu
document.addEventListener('click', function (e) {
  if (mobileMenu.classList.contains('open') && !header.contains(e.target)) {
    closeMobileMenu();
  }
});

// Fechar com ESC
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') closeMobileMenu();
});

/* ----------------------------------------------------------
   3. SCROLL SUAVE para âncoras internas
---------------------------------------------------------- */
document.querySelectorAll('.scroll-link').forEach(function (link) {
  link.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (!href || !href.startsWith('#')) return;

    const target = document.querySelector(href);
    if (!target) return;

    e.preventDefault();
    closeMobileMenu();

    const offset = header.offsetHeight + 8;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top: top, behavior: 'smooth' });
  });
});

/* ----------------------------------------------------------
   4. ANIMAÇÕES DE ENTRADA ao rolar (Intersection Observer)
---------------------------------------------------------- */
const animTargets = document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right');

const fadeObserver = new IntersectionObserver(function (entries) {
  entries.forEach(function (entry) {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      fadeObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -36px 0px' });

animTargets.forEach(function (el) { fadeObserver.observe(el); });

/* ----------------------------------------------------------
   5. VALIDAÇÃO DO FORMULÁRIO DE CONTATO
---------------------------------------------------------- */
const form = document.getElementById('contact-form');

if (form) {
  const nameInput  = form.querySelector('#f-name');
  const phoneInput = form.querySelector('#f-phone');
  const emailInput = form.querySelector('#f-email');
  const submitBtn  = form.querySelector('#f-submit');
  const successMsg = document.getElementById('form-success');

  function setInvalid(input, show) {
    const err = document.getElementById(input.id + '-error');
    input.classList.toggle('field-invalid', show);
    if (err) err.classList.toggle('hidden', !show);
  }

  function clearErrors() {
    [nameInput, phoneInput, emailInput].forEach(function (inp) {
      setInvalid(inp, false);
    });
  }

  // Limpar erro ao digitar
  [nameInput, phoneInput, emailInput].forEach(function (inp) {
    inp.addEventListener('input', function () { setInvalid(inp, false); });
  });

  // Máscara simples de telefone
  phoneInput.addEventListener('input', function () {
    let v = this.value.replace(/\D/g, '').slice(0, 11);
    if (v.length > 6) {
      v = '(' + v.slice(0,2) + ') ' + v.slice(2,7) + '-' + v.slice(7);
    } else if (v.length > 2) {
      v = '(' + v.slice(0,2) + ') ' + v.slice(2);
    } else if (v.length > 0) {
      v = '(' + v;
    }
    this.value = v;
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    clearErrors();
    let valid = true;

    if (!nameInput.value.trim()) {
      setInvalid(nameInput, true);
      valid = false;
    }

    const digits = phoneInput.value.replace(/\D/g, '');
    if (digits.length < 10) {
      setInvalid(phoneInput, true);
      valid = false;
    }

    if (emailInput.value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value.trim())) {
      setInvalid(emailInput, true);
      valid = false;
    }

    if (!valid) return;

    // Demo: exibe mensagem de sucesso (sem backend real)
    submitBtn.disabled = true;
    submitBtn.textContent = 'Enviando…';

    setTimeout(function () {
      successMsg.classList.remove('hidden');
      submitBtn.classList.add('hidden');

      setTimeout(function () {
        form.reset();
        successMsg.classList.add('hidden');
        submitBtn.classList.remove('hidden');
        submitBtn.disabled = false;
        submitBtn.textContent = 'Enviar mensagem';
      }, 4500);
    }, 900);
  });
}

/* ----------------------------------------------------------
   6. ANO DINÂMICO NO FOOTER
---------------------------------------------------------- */
const yearEl = document.getElementById('current-year');
if (yearEl) yearEl.textContent = new Date().getFullYear();
