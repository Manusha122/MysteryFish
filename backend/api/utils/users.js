function toPublicUser(user) {
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    highScore: user.highScore,
    level: user.level,
    gamesPlayed: user.gamesPlayed,
    best: Object.fromEntries(user.best || []),
    stars: Object.fromEntries(user.stars || [])
  };
}

module.exports = { toPublicUser };
