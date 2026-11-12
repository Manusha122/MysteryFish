// FILE: js/common.js
// PURPOSE: Shared helpers for all HTML pages: login protection, header and fish picture.
const Common = (() => {
  function escapeHtml(input) {
    return String(input).replace(/[&<>"']/g, ch => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[ch]));
  }

  function requireLogin() {
    if (localStorage.getItem('mf_token') && User.current()) return true;
    window.location.replace('index.html');
    return false;
  }

  function setupHeader() {
    const user = User.current();
    const profileLink = document.getElementById('header-profile');
    if (profileLink && user) profileLink.textContent = '☺ ' + user.username;
    const logout = document.getElementById('header-logout');
    if (logout) logout.addEventListener('click', () => {
      User.logout();
      sessionStorage.removeItem('mf_active_game');
      window.location.href = 'index.html';
    });
  }

  function paintHero() {
    const fish = FishData.byName('Clownfish');
    document.querySelectorAll('[data-hero-fish]').forEach(el => {
      el.replaceChildren(FishData.image(fish));
    });
  }

  function text(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  }
  return { escapeHtml, requireLogin, setupHeader, paintHero, text };
})();
