// LEADERBOARD MODULE: loads ranked players from the Mystery Fish API.
const Leaderboard = (() => {
  return { get: () => User.getLeaderboard() };
})();
