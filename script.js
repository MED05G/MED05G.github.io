(() => {
  const root = document.documentElement;
  const themeButton = document.getElementById('theme');
  const systemTheme = matchMedia('(prefers-color-scheme: dark)');
  let explicitTheme = false;
  try {
    explicitTheme = ['light', 'dark'].includes(localStorage.getItem('mef-theme'));
  } catch (error) { /* Theme controls still work without storage. */ }
  function updateThemeControl() {
    const isDark = root.dataset.theme === 'dark';
    themeButton.setAttribute('aria-pressed', String(isDark));
    themeButton.setAttribute('aria-label', `Switch to ${isDark ? 'light' : 'dark'} theme`);
    themeButton.innerHTML = `${isDark ? 'Light' : 'Dark'} <span aria-hidden="true">◐</span>`;
    document.querySelector('meta[name="theme-color"]').content = isDark ? '#141c1c' : '#f7f7f2';
  }
  themeButton.addEventListener('click', () => {
    root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
    explicitTheme = true;
    try { localStorage.setItem('mef-theme', root.dataset.theme); } catch (error) { /* Storage is optional. */ }
    updateThemeControl();
  });
  systemTheme.addEventListener('change', event => {
    if (!explicitTheme) {
      root.dataset.theme = event.matches ? 'dark' : 'light';
      updateThemeControl();
    }
  });
  updateThemeControl();
  const menuButton = document.getElementById('menu-toggle');
  const nav = document.getElementById('main-nav');
  const mobile = matchMedia('(max-width: 760px)');
  function setMenu(open) {
    nav.classList.toggle('is-open', open);
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.innerHTML = `${open ? 'Close' : 'Menu'} <span aria-hidden="true">${open ? '−' : '+'}</span>`;
  }
  menuButton.addEventListener('click', () => setMenu(menuButton.getAttribute('aria-expanded') !== 'true'));
  nav.addEventListener('click', event => {
    if (event.target.closest('a') && mobile.matches) setMenu(false);
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') {
      setMenu(false);
      menuButton.focus();
    }
  });
  mobile.addEventListener('change', () => setMenu(false));
  document.querySelectorAll('[data-print]').forEach(button => {
    button.addEventListener('click', () => window.print());
  });
})();
