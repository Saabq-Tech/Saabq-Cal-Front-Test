/**
 * Saabq-Cal — Language Manager
 * Handles AR/EN switching with data-attribute text swapping and RTL/LTR
 */
(function() {
  'use strict';

  const STORAGE_KEY = 'saabq-lang';
  const AR = 'ar';
  const EN = 'en';

  function getPreferredLang() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return stored;
    return AR; // Arabic-first default
  }

  function applyLang(lang) {
    const html = document.documentElement;
    html.setAttribute('lang', lang);
    html.setAttribute('dir', lang === AR ? 'rtl' : 'ltr');

    // Swap all text nodes with data-ar / data-en attributes
    document.querySelectorAll('[data-ar][data-en]').forEach(el => {
      el.textContent = el.getAttribute(lang === AR ? 'data-ar' : 'data-en');
    });

    // Swap placeholder text
    document.querySelectorAll('[data-ar-placeholder][data-en-placeholder]').forEach(el => {
      el.placeholder = el.getAttribute(lang === AR ? 'data-ar-placeholder' : 'data-en-placeholder');
    });

    // Update toggle button text
    document.querySelectorAll('[data-lang-toggle]').forEach(btn => {
      const label = btn.querySelector('.lang-label');
      if (label) {
        label.textContent = lang === AR ? 'EN' : 'عربي';
      }
    });

    localStorage.setItem(STORAGE_KEY, lang);
  }

  function toggleLang() {
    const current = document.documentElement.getAttribute('lang') || AR;
    const next = current === AR ? EN : AR;
    applyLang(next);
  }

  function setLang(lang) {
    applyLang(lang);
  }

  // Apply lang immediately
  applyLang(getPreferredLang());

  // Bind toggles after DOM ready
  document.addEventListener('DOMContentLoaded', function() {
    applyLang(getPreferredLang());

    document.querySelectorAll('[data-lang-toggle]').forEach(btn => {
      btn.addEventListener('click', toggleLang);
    });
  });

  // Expose globally
  window.SaabqLang = { toggle: toggleLang, set: setLang, get: getPreferredLang };
})();
