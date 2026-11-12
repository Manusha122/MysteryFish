// FILE: js/pages/profile.js
// PAGE: profile.html
// TASK: Show the signed-in player's stored scores and statistics.
if (Common.requireLogin()) {
  Common.setupHeader(); Common.paintHero();
  (async () => {
    try {
      const user = await User.refreshProfile();
      const stars = Object.values(user.stars).reduce((total, amount) => total + amount, 0);
      Common.text('profile-name', user.username);
      Common.text('profile-level', `LEVEL ${user.level} · REEF EXPLORER`);
      Common.text('profile-email', user.email);
      Common.text('profile-score', user.highScore);
      Common.text('profile-games', user.gamesPlayed);
      Common.text('profile-stars', stars);
    } catch (error) {
      Common.text('profile-email', error.message);
    }
  })();
}
