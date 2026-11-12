// FILE: js/pages/levels.js
// PAGE: levels.html
// TASK: Display three difficulty levels, lock future levels, and start a new round.
if (Common.requireLogin()) {
  Common.setupHeader();
  (async () => {
    try {
      const user = await User.refreshProfile();
      const totalStars = Object.values(user.stars).reduce((sum, value) => sum + value, 0);
      Common.text('total-stars', `★ ${totalStars}/9`);
      const names = { 1: 'Easy', 2: 'Medium', 3: 'Hard' };

      for (let level = 1; level <= 3; level++) {
        const open = level <= user.level;
        const stars = user.stars[level] || 0;
        const btn = document.createElement('button');
        btn.className = `lvl l${level}`;
        btn.disabled = !open;
        btn.type = 'button';
        btn.innerHTML = `
          <span class="num">${open ? level : '🔒'}</span>
          <span><small>Level ${level} · ${Quiz.QUESTIONS_PER_LEVEL[level]} fish to find</small>
          <b>${names[level]}</b><em>${'★'.repeat(stars)}${'☆'.repeat(3 - stars)}</em></span>
          <span class="state">${!open ? 'LOCKED' : user.best[level] ? 'BEST ' + user.best[level] : 'PLAY ▶'}</span>`;
        btn.addEventListener('click', () => {
          GameState.start(level);
          window.location.href = 'game.html';
        });
        document.getElementById('level-list').appendChild(btn);
      }
    } catch (error) {
      Common.text('total-stars', error.message);
    }
  })();
}
