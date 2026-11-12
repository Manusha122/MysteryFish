// FILE: js/pages/revival.js
// PAGE: revival.html
// TASK: Load Fish API puzzle and give ONE attempt to restore ONE life.
if (Common.requireLogin()) {
  Common.setupHeader();
  const game = GameState.get();
  if (!game) window.location.replace('levels.html');
  else if (game.status === 'revived') showSuccess();
  else if (game.status === 'gameover' || game.status === 'complete') window.location.replace('result.html');
  else if (game.status !== 'answered' || game.lives !== 0 || game.revivalUsed) window.location.replace('game.html');
  else loadPuzzle();

  Common.text('revival-score', game?.score || 0);
  Common.text('revival-lives', `${game?.lives || 0}/3`);

  // Skipping the revival ends the run and saves the score once.
  document.getElementById('skip-button').addEventListener('click', async event => {
    event.preventDefault();
    try {
      await GameState.endGame();
      window.location.href = 'result.html';
    } catch (error) {
      Common.text('revival-description', `Could not save your game: ${error.message}. Try ending the dive again.`);
    }
  });

  // STEP 1: ask the real Fish API. If it fails, show the error + a retry button + a backup puzzle button.
  async function loadPuzzle() {
    let puzzle;
    try { puzzle = await FishApi.getPuzzle(); }
    catch (error) {
      console.error('Fish API error:', error);
      Common.text('revival-title', 'The Fish API is not responding');
      Common.text('revival-description', 'Check your internet connection or browser access. Your revival chance is still available. You can retry, or use a backup puzzle.');
      const actions = document.getElementById('revival-actions');
      const backup = document.createElement('button'); backup.type = 'button'; backup.className = 'btn light';
      backup.textContent = 'Use a backup puzzle instead';
      backup.addEventListener('click', () => { retry.remove(); backup.remove(); showPuzzle(FishApi.getBackupPuzzle()); });
      const retry = document.createElement('button'); retry.type = 'button'; retry.className = 'btn blue';
      retry.textContent = 'Try loading the puzzle again';
      retry.addEventListener('click', () => { retry.remove(); backup.remove(); loadPuzzle(); });
      actions.prepend(backup); actions.prepend(retry);
      return;
    }
    showPuzzle(puzzle);
  }

  // STEP 2: show the picture and the 4 answer choices, then check the player's answer.
  function showPuzzle(puzzle) {
    Common.text('revival-title', puzzle.source === 'backup' ? 'Backup puzzle: count the fish!' : 'Count the fish to revive!');
    Common.text('revival-description', (puzzle.source === 'backup' ? 'The Fish API was not reachable, so this is a backup puzzle. ' : '') +
      'How many blue fish do you see in the picture? Pick one answer.');
    const image = document.createElement('img'); image.src = puzzle.image; image.alt = 'Fish counting puzzle';
    document.getElementById('api-picture').replaceChildren(image);
    const answers = document.getElementById('puzzle-answers');
    answers.replaceChildren();
    puzzle.options.forEach(value => {
      const label = document.createElement('label');
      const radio = document.createElement('input'); radio.type = 'radio'; radio.name = 'fish-count'; radio.value = value;
      const visible = document.createElement('span'); visible.textContent = value;
      label.append(radio, visible); answers.appendChild(label);
    });
    document.getElementById('puzzle-form').hidden = false;
    document.getElementById('puzzle-form').onsubmit = async event => {
      event.preventDefault();
      const selected = document.querySelector('input[name="fish-count"]:checked');
      if (!selected) { Common.text('puzzle-error', 'Choose a number first.'); return; }
      const solved = Number(selected.value) === puzzle.solution;
      try {
        await GameState.revive(solved);
      } catch (error) {
        Common.text('puzzle-error', `Could not save your game: ${error.message}. Submit again to retry.`);
        return;
      }
      if (solved) showSuccess();
      else showFailure(puzzle.solution);
    };
  }

  function hideForm() {
    document.getElementById('puzzle-form').hidden = true;
    document.getElementById('api-picture').replaceChildren();
  }
  function showSuccess() {
    hideForm();
    Common.text('revival-title', '♥ One life restored!');
    Common.text('revival-description', 'Your score and level progress are safe. Continue with the next question.');
    const actions = document.getElementById('revival-actions'); actions.replaceChildren();
    const continueButton = document.createElement('button');
    continueButton.className = 'btn blue'; continueButton.textContent = '→ Continue game';
    continueButton.addEventListener('click', async () => {
      try {
        await GameState.advance();
        window.location.href = 'game.html';
      } catch (error) {
        Common.text('revival-description', `Could not save your game: ${error.message}. Please try again.`);
      }
    });
    actions.appendChild(continueButton);
  }
  function showFailure(correctAnswer) {
    hideForm();
    Common.text('revival-title', 'No life restored. Game Over.');
    Common.text('revival-description', 'The correct Fish API answer was ' + correctAnswer + '.');
    const actions = document.getElementById('revival-actions'); actions.replaceChildren();
    const link = document.createElement('a'); link.href = 'result.html';
    link.className = 'btn blue'; link.textContent = '→ View Game Over'; actions.appendChild(link);
  }
}
