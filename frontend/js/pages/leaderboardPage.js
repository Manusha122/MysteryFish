// FILE: js/pages/leaderboardPage.js
// PAGE: leaderboard.html
// TASK: Make one leaderboard row for each local player.
if (Common.requireLogin()) {
  Common.setupHeader();
  (async () => {
    try {
      const rows = await Leaderboard.get();
      const mine = rows.find(row => row.me);
      Common.text('my-rank', mine ? `You are #${mine.rank} on this leaderboard!` : 'Play to enter the leaderboard.');
      const table = document.getElementById('leaderboard-rows');
      rows.forEach(row => {
        const tr = document.createElement('tr');
        if (row.me) tr.className = 'me';
        const rank = document.createElement('td'); rank.textContent = row.rank;
        const name = document.createElement('td'); name.textContent = row.name + (row.me ? ' (YOU)' : '');
        const score = document.createElement('td'); score.textContent = row.score;
        tr.append(rank, name, score); table.appendChild(tr);
      });
    } catch (error) {
      Common.text('my-rank', error.message);
    }
  })();
}
