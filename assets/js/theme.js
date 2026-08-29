/**
 * Saabq-Cal — Theme Manager
 * Handles light/dark mode with localStorage persistence
 */
(function() {
  'use strict';

  const STORAGE_KEY = 'saabq-theme';
  const DARK = 'dark';
  const LIGHT = 'light';

  function getPreferredTheme() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return stored;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? DARK : LIGHT;
  }

  function applyTheme(theme) {
    const html = document.documentElement;
    html.setAttribute('data-theme', theme);

    // Update all toggle buttons
    document.querySelectorAll('[data-theme-toggle]').forEach(btn => {
      const sunIcon = btn.querySelector('.icon-sun');
      const moonIcon = btn.querySelector('.icon-moon');
      if (sunIcon && moonIcon) {
        sunIcon.style.display = theme === DARK ? 'block' : 'none';
        moonIcon.style.display = theme === DARK ? 'none' : 'block';
      }
    });

    localStorage.setItem(STORAGE_KEY, theme);
  }

  function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme') || LIGHT;
    const next = current === DARK ? LIGHT : DARK;
    applyTheme(next);
  }

  // Apply theme immediately (prevent flash)
  applyTheme(getPreferredTheme());

  // Bind toggle buttons after DOM ready
  document.addEventListener('DOMContentLoaded', function() {
    // Re-apply to ensure icons are correct
    applyTheme(getPreferredTheme());

    document.querySelectorAll('[data-theme-toggle]').forEach(btn => {
      btn.addEventListener('click', toggleTheme);
    });
  });

  // Listen for system preference changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    if (!localStorage.getItem(STORAGE_KEY)) {
      applyTheme(e.matches ? DARK : LIGHT);
    }
  });

  // Expose globally
  window.SaabqTheme = { toggle: toggleTheme, apply: applyTheme, get: getPreferredTheme };
})();
