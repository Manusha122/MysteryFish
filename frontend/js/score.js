// FILE: js/score.js
// PURPOSE: The scoring rules are defined in one place, not in your HTML.
const Score = {
  START_LIVES: 3,       // Every game begins with three hearts.
  CORRECT_POINTS: 10,  // A correct guess earns ten points.

  // Every incorrect answer or expired timer costs one life.
  loseLife(currentLives) { return Math.max(0, currentLives - 1); },

  // Stars are based on the share of correct answers.
  calculateStars(correct, total) {
    const ratio = total > 0 ? correct / total : 0;
    return ratio >= 0.8 ? 3 : ratio >= 0.6 ? 2 : 1;
  }
};
