const test = require('node:test');
const assert = require('node:assert/strict');
const { isValidGameResult } = require('../api/utils/gameResult');

test('accepts a completed game with matching score and stars', () => {
  assert.equal(isValidGameResult({
    gameId: 'game-1', level: 1, score: 40, stars: 3,
    correct: 4, totalQuestions: 5, status: 'complete'
  }), true);
});

test('accepts a game over with no stars', () => {
  assert.equal(isValidGameResult({
    gameId: 'game-2', level: 2, score: 30, stars: 0,
    correct: 3, totalQuestions: 10, status: 'gameover'
  }), true);
});

test('rejects inconsistent game scores, stars, and level question counts', () => {
  const valid = {
    gameId: 'game-3', level: 1, score: 40, stars: 3,
    correct: 4, totalQuestions: 5, status: 'complete'
  };
  assert.equal(isValidGameResult({ ...valid, score: 30 }), false);
  assert.equal(isValidGameResult({ ...valid, stars: 2 }), false);
  assert.equal(isValidGameResult({ ...valid, totalQuestions: 10 }), false);
});
