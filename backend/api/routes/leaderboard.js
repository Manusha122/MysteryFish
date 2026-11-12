const { Router } = require('express');
const User = require('../../db/models/User');
const requireAuth = require('../middleware/auth');

const router = Router();

router.get('/', requireAuth, async (req, res, next) => {
  try {
    const users = await User.find().sort({ highScore: -1, username: 1 }).limit(50)
      .select('username highScore');
    const rows = users.map((user, index) => ({
      rank: index + 1,
      name: user.username,
      score: user.highScore,
      me: user.id === req.user.id
    }));
    return res.json({ rows });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
