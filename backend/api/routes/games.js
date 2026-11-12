const { Router } = require('express');
const Game = require('../../db/models/Game');
const User = require('../../db/models/User');
const requireAuth = require('../middleware/auth');
const { isValidGameResult } = require('../utils/gameResult');
const { toPublicUser } = require('../utils/users');

const router = Router();
router.use(requireAuth);

router.post('/', async (req, res, next) => {
  try {
    const result = req.body || {};
    const { gameId, level, score, stars, correct, totalQuestions, status } = result;
    if (!isValidGameResult(result)) {
      return res.status(400).json({ error: 'Game result is invalid.' });
    }

    try {
      await Game.create({
        user: req.user.id, gameId, level, score, stars, correct, totalQuestions, status
      });
    } catch (error) {
      if (error.code === 11000) {
        const [existing, user] = await Promise.all([
          Game.findOne({ user: req.user.id, gameId }),
          User.findById(req.user.id)
        ]);
        return res.status(200).json({ game: existing, user: toPublicUser(user), duplicate: true });
      }
      throw error;
    }

    const levelKey = String(level);
    const bestPath = `best.${levelKey}`;
    const starsPath = `stars.${levelKey}`;
    const updatedUser = await User.findByIdAndUpdate(req.user.id, [
      {
        $set: {
          gamesPlayed: { $add: [{ $ifNull: ['$gamesPlayed', 0] }, 1] },
          [bestPath]: { $max: [{ $ifNull: [`$${bestPath}`, 0] }, score] },
          [starsPath]: { $max: [{ $ifNull: [`$${starsPath}`, 0] }, stars] },
          level: stars >= 2 && level < 3 ? { $max: [{ $ifNull: ['$level', 1] }, level + 1] } : '$level'
        }
      },
      {
        $set: {
          highScore: {
            $add: [1, 2, 3].map(number => ({ $ifNull: [`$best.${number}`, 0] }))
          }
        }
      }
    ], { new: true });

    const game = await Game.findOne({ user: req.user.id, gameId });
    return res.status(201).json({ game, user: toPublicUser(updatedUser) });
  } catch (error) {
    return next(error);
  }
});

router.get('/mine', async (req, res, next) => {
  try {
    const limit = Math.min(Math.max(Number.parseInt(req.query.limit, 10) || 20, 1), 100);
    const games = await Game.find({ user: req.user.id })
      .sort({ createdAt: -1 }).limit(limit).select('-user -__v');
    return res.json({ games });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
