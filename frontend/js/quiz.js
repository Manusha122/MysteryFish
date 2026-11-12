// FILE: js/quiz.js
// PURPOSE: Pick the fish questions and generate four choices for each question.
// DEPENDS ON: js/fishData.js (the list of fish and hints).
const Quiz = (() => {
  const QUESTIONS_PER_LEVEL = { 1: 5, 2: 10, 3: 12 };

  function shuffle(items) {
    const array = [...items];
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  function createQuestions(level) {
    const allNames = FishData.list.map(fish => fish.name);
    return shuffle(FishData.byLevel(level))
      .slice(0, QUESTIONS_PER_LEVEL[level])
      .map(fish => {
        // We add three wrong answers and one correct answer.
        const wrong = shuffle(allNames.filter(name => name !== fish.name)).slice(0, 3);
        const options = shuffle([fish.name, ...wrong]);
        return { fishName: fish.name, options, answer: options.indexOf(fish.name) };
      });
  }
  return { createQuestions, QUESTIONS_PER_LEVEL };
})();
