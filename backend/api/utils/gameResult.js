function isValidGameResult(result) {
  if (!result || typeof result.gameId !== 'string' ||
      result.gameId.length < 1 || result.gameId.length > 100 ||
      !Number.isInteger(result.level) || result.level < 1 || result.level > 3 ||
      !Number.isInteger(result.score) || result.score < 0 ||
      !Number.isInteger(result.stars) || result.stars < 0 || result.stars > 3 ||
      !Number.isInteger(result.correct) || result.correct < 0 ||
      !Number.isInteger(result.totalQuestions) ||
      !['complete', 'gameover'].includes(result.status)) {
    return false;
  }

  const expectedQuestions = [0, 5, 10, 12][result.level];
  if (result.totalQuestions !== expectedQuestions || result.correct > result.totalQuestions ||
      result.score !== result.correct * 10) {
    return false;
  }

  const ratio = result.correct / result.totalQuestions;
  const expectedStars = ratio >= 0.8 ? 3 : ratio >= 0.6 ? 2 : 1;
  return result.status === 'complete'
    ? result.stars === expectedStars
    : result.stars === 0;
}

module.exports = { isValidGameResult };
