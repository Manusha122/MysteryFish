// FILE: js/gameState.js
// PURPOSE: Coordinates questions, timer, lives, points, progress and revival.
// IMPORTANT: This file uses sessionStorage so the game survives page changes
//            and refreshes in the current browser tab.
// DEPENDS ON: user.js, score.js, quiz.js, events.js.
const GameState = (() => {
  const KEY = 'mf_active_game';
  const SECONDS_PER_QUESTION = 30;
  const createGameId = () => window.crypto && crypto.randomUUID
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  function read() {
    const saved = sessionStorage.getItem(KEY);
    if (!saved) return null;

    let state;
    try { state = JSON.parse(saved); }
    catch (error) {
      if (!(error instanceof SyntaxError)) throw error;
    }

    const valid = state &&
      [1, 2, 3].includes(state.level) &&
      Array.isArray(state.questions) &&
      state.questions.length === Quiz.QUESTIONS_PER_LEVEL[state.level] &&
      Number.isInteger(state.questionIndex) &&
      state.questionIndex >= 0 &&
      state.questionIndex < state.questions.length &&
      state.questions.every(question =>
        question &&
        Array.isArray(question.options) &&
        question.options.length === 4 &&
        Number.isInteger(question.answer) &&
        question.answer >= 0 &&
        question.answer < question.options.length &&
        question.options[question.answer] === question.fishName &&
        question.options.every(name => FishData.byName(name))
      );

    if (valid) return state;
    sessionStorage.removeItem(KEY);
    return null;
  }
  const save = state => { sessionStorage.setItem(KEY, JSON.stringify(state)); return state; };
  const currentQuestion = state => state.questions[state.questionIndex];

  function start(level) {
    const user = User.current();
    level = Number(level);
    if (!user || ![1, 2, 3].includes(level) || level > user.level) return null;
    const state = {
      gameId: createGameId(),
      level,
      questions: Quiz.createQuestions(level),
      questionIndex: 0,
      score: 0,
      lives: Score.START_LIVES,
      correct: 0,
      revivalUsed: false,
      status: 'asking', // asking -> answered -> asking / revived / complete / gameover
      selected: null,
      result: null,
      deadline: Date.now() + SECONDS_PER_QUESTION * 1000,
      recorded: false
    };
    Events.emit('LevelStarted', { level });
    return save(state);
  }

  function get() { return read(); }
  function timeLeft(state = read()) {
    return state?.status === 'asking' ? Math.max(0, Math.ceil((state.deadline - Date.now()) / 1000)) : 0;
  }

  function submitAnswer(choiceIndex) {
    const state = read();
    if (!state || state.status !== 'asking') return null;
    // If the clock ran out before clicking, count a timeout instead.
    if (timeLeft(state) === 0) return expire();
    const q = currentQuestion(state);
    if (!Number.isInteger(choiceIndex) || choiceIndex < 0 || choiceIndex >= q.options.length) return null;
    const correct = choiceIndex === q.answer;
    state.selected = choiceIndex;
    state.result = correct ? 'correct' : 'wrong';
    state.status = 'answered';
    Events.emit('AnswerSubmitted', { index: choiceIndex, correct });
    if (correct) {
      state.score += Score.CORRECT_POINTS;
      state.correct++;
      Events.emit('CorrectAnswer', { score: state.score });
    } else {
      state.lives = Score.loseLife(state.lives);
      Events.emit('WrongAnswer', { lives: state.lives });
    }
    return save(state);
  }

  function expire() {
    const state = read();
    if (!state || state.status !== 'asking') return state;
    state.lives = Score.loseLife(state.lives);
    state.status = 'answered';
    state.selected = null;
    state.result = 'time';
    Events.emit('TimeUp', { lives: state.lives });
    return save(state);
  }

  async function saveResult(state, stars) {
    state.stars = stars;
    state.recorded = true;
    save(state);
    try {
      await User.recordGame(state.level, state.score, stars, {
        gameId: state.gameId,
        correct: state.correct,
        totalQuestions: state.questions.length,
        status: state.status
      });
    } catch (error) {
      state.recorded = false;
      save(state);
      throw error;
    }
    return save(state);
  }

  async function finish() {
    const state = read();
    if (!state || state.recorded) return state;
    state.status = 'complete';
    const stars = Score.calculateStars(state.correct, state.questions.length);
    Events.emit('LevelCompleted', { level: state.level, score: state.score });
    return saveResult(state, stars);
  }

  async function endGame() {
    const state = read();
    if (!state || state.recorded) return state;
    state.status = 'gameover';
    Events.emit('GameOver', { level: state.level, score: state.score });
    return saveResult(state, 0);
  }

  async function advance() {
    const state = read();
    if (!state || !['answered', 'revived'].includes(state.status)) return state;
    if (state.lives === 0) return state; // Must first try revival or end the game.
    if (state.questionIndex === state.questions.length - 1) return await finish();
    state.questionIndex++;
    state.selected = null;
    state.result = null;
    state.status = 'asking';
    state.deadline = Date.now() + SECONDS_PER_QUESTION * 1000;
    return save(state);
  }

  async function revive(solved) {
    const state = read();
    if (state?.status === 'gameover' && state.revivalUsed && !state.recorded) {
      return await endGame();
    }
    if (!state || state.lives !== 0 || state.revivalUsed || state.status !== 'answered') return null;
    state.revivalUsed = true; // One attempt per game, whether right or wrong.
    if (solved) {
      state.lives = 1;
      state.status = 'revived';
      Events.emit('RevivalSolved', { score: state.score });
      return save(state);
    }
    save(state);
    return await endGame();
  }

  return { start, get, timeLeft, submitAnswer, expire, advance, revive,
    finish, endGame, SECONDS_PER_QUESTION };
})();
