(function () {
  // 1. Immediately apply theme before DOMContentLoaded to prevent FOUC
  const savedTheme = localStorage.getItem('nexus-theme');
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
  document.documentElement.setAttribute('data-theme', initialTheme);

  // 2. Global theme switcher
  window.toggleTheme = function (mode) {
    if (!mode) {
      const current = document.documentElement.getAttribute('data-theme') || 'light';
      mode = current === 'dark' ? 'light' : 'dark';
    }
    document.documentElement.setAttribute('data-theme', mode);
    localStorage.setItem('nexus-theme', mode);
    updateThemeButtons(mode);
    window.dispatchEvent(new CustomEvent('nexus-theme-change', { detail: { theme: mode } }));
  };

  function updateThemeButtons(theme) {
    // Topbar toggle buttons
    const topbarBtns = document.querySelectorAll('.mode-toggle button');
    topbarBtns.forEach((btn, idx) => {
      const isLightBtn = btn.textContent.toLowerCase().includes('clair') || btn.querySelector('.ti-sun');
      if (theme === 'light') {
        btn.classList.toggle('active', !!isLightBtn);
      } else {
        btn.classList.toggle('active', !isLightBtn);
      }
    });

    // Settings page theme buttons
    const settingsBtns = document.querySelectorAll('.theme-btn');
    settingsBtns.forEach((btn) => {
      const isLightBtn = btn.textContent.toLowerCase().includes('clair') || btn.querySelector('.ti-sun');
      if (theme === 'light') {
        btn.classList.toggle('active', !!isLightBtn);
      } else {
        btn.classList.toggle('active', !isLightBtn);
      }
    });
  }

  // 3. Setup event listeners when DOM is loaded
  document.addEventListener('DOMContentLoaded', function () {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    updateThemeButtons(currentTheme);

    // Bind click events to topbar toggle buttons
    const topbarBtns = document.querySelectorAll('.mode-toggle button');
    topbarBtns.forEach((btn) => {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        const isLight = this.textContent.toLowerCase().includes('clair') || this.querySelector('.ti-sun');
        window.toggleTheme(isLight ? 'light' : 'dark');
      });
    });

    // Bind click events to settings page theme buttons
    const settingsBtns = document.querySelectorAll('.theme-btn');
    settingsBtns.forEach((btn) => {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        const isLight = this.textContent.toLowerCase().includes('clair') || this.querySelector('.ti-sun');
        window.toggleTheme(isLight ? 'light' : 'dark');
      });
    });

    // Keyboard shortcut Cmd+K or Ctrl+K for search
    document.addEventListener('keydown', function (e) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.getElementById('globalSearchInput') || document.querySelector('.topbar .search input');
        if (searchInput) {
          searchInput.focus();
          searchInput.select();
        }
      }
    });
  });
})();
