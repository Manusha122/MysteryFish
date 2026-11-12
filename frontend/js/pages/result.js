// FILE: js/pages/result.js
// PAGE: result.html
// TASK: Display completed-level scores and game-over scores.
if (Common.requireLogin()) {
  Common.setupHeader();
  (async () => {
    const state = GameState.get();
    if (!state) window.location.replace('levels.html');
    else if (!['complete', 'gameover'].includes(state.status)) window.location.replace('game.html');
    else {
      let saveError = null;
      try {
        if (!state.recorded) {
          const saved = state.status === 'complete'
            ? await GameState.finish()
            : await GameState.endGame();
          state.recorded = Boolean(saved && saved.recorded);
        }
      } catch (error) {
        saveError = error;
      }

      const won = state.status === 'complete';
      if (won) Common.paintHero();
      else {
        const hero = document.querySelector('[data-hero-fish]');
        const image = document.createElement('img');
        image.src = 'game%20images/menu%20fish.png';
        image.alt = 'Menu fish';
        hero.replaceChildren(image);
      }
      Common.text('result-heading', won ? 'Level Complete!' : 'Game Over');
      if (state.recorded) {
        Common.text('result-subtitle', won ? 'You finished this reef. Well done!' : 'The ocean still has mysteries waiting for you.');
      } else {
        Common.text('result-subtitle', `Your result could not be saved: ${saveError.message} Use Retry Save to try again.`);
      }
      Common.text('result-title', won ? 'Your level recap' : 'Your dive recap');
      Common.text('final-score', state.score);
      Common.text('final-detail', `${state.correct} correct answers × 10 points`);
      Common.text('result-level', 'Level ' + state.level);
      Common.text('result-question', `${state.questionIndex + 1}/${state.questions.length}`);
      document.getElementById('result-stars').textContent = won ? '★'.repeat(state.stars) + '☆'.repeat(3 - state.stars) : '';
      const actions = document.getElementById('result-actions');
      if (!state.recorded) {
        const retry = document.createElement('button');
        retry.className = 'btn light';
        retry.textContent = '↻ Retry Save';
        retry.addEventListener('click', async () => {
          retry.disabled = true;
          try {
            const saved = won ? await GameState.finish() : await GameState.endGame();
            state.recorded = Boolean(saved && saved.recorded);
            Common.text('result-subtitle', won ? 'You finished this reef. Well done!' : 'The ocean still has mysteries waiting for you.');
            retry.remove();
          } catch (error) {
            retry.disabled = false;
            Common.text('result-subtitle', `Your result could not be saved: ${error.message} Try again.`);
          }
        });
        actions.appendChild(retry);
      }
      const next = User.current().level > state.level && state.level < 3 && won;
      const play = document.createElement('button');
      play.className = 'btn yellow';
      play.textContent = next ? '▷ Next Level' : '↻ Play Again';
      play.addEventListener('click', () => {
        GameState.start(next ? state.level + 1 : state.level);
        window.location.href = 'game.html';
      });
      actions.appendChild(play);
    }
  })();
}
