// FILE: js/pages/game.js
// PAGE: game.html
// TASK: Show fish questions, countdown, answer feedback and Next button.
// KEY LINKS: GameState handles scoring; FishData handles images and hints.
if (Common.requireLogin()) {
  Common.setupHeader();
  let clock = null;
  let game = GameState.get();
  if (!game) window.location.replace('levels.html');
  else if (['complete', 'gameover'].includes(game.status)) window.location.replace('result.html');
  else { render(); clock = window.setInterval(updateClock, 250); }

  function updateClock() {
    const state = GameState.get();
    if (!state || state.status !== 'asking') return;
    const seconds = GameState.timeLeft(state);
    const display = document.getElementById('time-left');
    display.textContent = `00:${String(seconds).padStart(2, '0')}`;
    display.className = seconds <= 10 ? 'red' : 'blue';
    if (seconds === 0) { GameState.expire(); render(); }
  }

  function render() {
    game = GameState.get();
    if (!game || ['complete', 'gameover'].includes(game.status)) {
      window.location.replace('result.html');
      return;
    }
    const question = game.questions[game.questionIndex];
    const fish = FishData.byName(question.fishName);
    const answered = game.status !== 'asking';

    Common.text('level-number', 'LEVEL ' + game.level);
    Common.text('question-progress', `Question ${game.questionIndex + 1} of ${game.questions.length}`);
    Common.text('score-value', game.score);
    Common.text('lives-value', '♥'.repeat(game.lives) + '♡'.repeat(3 - game.lives));
    Common.text('question-label', `MYSTERY FISH · ${String(game.questionIndex + 1).padStart(2, '0')}`);
    Common.text('revival-badge', game.revivalUsed ? 'Rescue used' : '1 rescue');
    document.getElementById('progress-fill').style.width = `${(game.questionIndex / game.questions.length) * 100}%`;
    const fishPicture = document.getElementById('fish-picture');
    if (answered) {
      fishPicture.replaceChildren(FishData.image(fish));
    } else {
      fishPicture.innerHTML = FishData.mystery;
    }

    // Answer buttons: change colours to show correct (green) or wrong (red).
    const answers = document.getElementById('answer-options');
    answers.replaceChildren();
    question.options.forEach((name, index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'opt';
      button.disabled = answered;
      const letter = document.createElement('i');
      letter.textContent = 'ABCD'[index];
      const label = document.createTextNode(name);
      const symbol = document.createElement('span');
      if (answered && index === question.answer) { button.classList.add('ok'); symbol.textContent = '✓'; }
      else if (answered && index === game.selected) { button.classList.add('bad'); symbol.textContent = '✕'; }
      button.append(letter, label, symbol);
      button.addEventListener('click', () => { GameState.submitAnswer(index); render(); });
      answers.appendChild(button);
    });

    const side = document.getElementById('game-side');
    if (!answered) {
      side.innerHTML = `<span class="pill">🐚 CLUE SHELL</span><h2>Find the hidden fish!</h2>
        <div class="note"><b>✨ Your clues</b><ol id="fish-hints"></ol></div>`;
      const hints = document.getElementById('fish-hints');
      fish.hints.forEach(hint => { const li = document.createElement('li'); li.textContent = hint; hints.appendChild(li); });
      updateClock();
      return;
    }

    // Once the question ends, the timer stops and feedback appears.
    const correct = game.result === 'correct';
    const headline = correct ? 'Correct!' : game.result === 'time' ? 'Time’s up!' : 'Wrong!';
    const explanation = correct ? `You spotted the ${fish.name}.` :
      game.result === 'time' ? `The timer ran out. This fish is a ${fish.name}.` :
      `This fish is a ${fish.name}.`;
    side.replaceChildren();
    const top = document.createElement('div');
    top.className = `res ${correct ? 'good' : 'badr'}`;
    top.innerHTML = `<span class="icon">${correct ? '✓' : '✕'}</span>
      <span class="tag ${correct ? 'ok' : 'bad'}">${correct ? '+10 POINTS' : '−1 LIFE'}</span>`;
    const title = document.createElement('h2'); title.className = correct ? 'g' : 'r'; title.textContent = headline;
    const detail = document.createElement('p'); detail.className = 'muted'; detail.textContent = explanation;
    const fact = document.createElement('div'); fact.className = 'note';
    const name = document.createElement('b'); name.textContent = 'Meet the ' + fish.name;
    const about = document.createElement('span'); about.textContent = fish.fact;
    fact.append(name, about);
    const summary = document.createElement('p'); summary.className = 'muted small';
    summary.textContent = `Score ${game.score} · ${game.lives} lives remaining`;
    side.append(top, title, detail, fact, summary);

    if (game.status === 'revived') {
      addButton('▶ Keep swimming', () => moveNext());
    } else if (game.lives > 0) {
      addButton(game.questionIndex + 1 === game.questions.length ? '★ Finish reef' : '▶ Next fish', () => moveNext());
    } else if (!game.revivalUsed) {
      addButton('🛟 Use rescue', () => window.location.href = 'revival.html');
      addLink('Skip to Game Over', () => finishLoss());
    } else {
      addButton('View results', () => finishLoss());
    }
    function addButton(text, action) {
      const button = document.createElement('button'); button.className = 'btn blue'; button.textContent = text;
      button.addEventListener('click', () => {
        Promise.resolve(action()).catch(showSaveError);
      });
      side.appendChild(button);
    }
    function addLink(text, action) {
      const button = document.createElement('button'); button.className = 'btn light'; button.textContent = text;
      button.addEventListener('click', action); side.appendChild(button);
    }
  }

  async function moveNext() {
    const state = await GameState.advance();
    if (state?.status === 'complete') window.location.href = 'result.html';
    else render();
  }
  async function finishLoss() {
    await GameState.endGame();
    window.location.href = 'result.html';
  }
  function showSaveError(error) {
    const message = document.createElement('p');
    message.className = 'err';
    message.setAttribute('role', 'alert');
    message.textContent = `Could not save your game: ${error.message}. Try the action again.`;
    document.getElementById('game-side').appendChild(message);
  }
}
