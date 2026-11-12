const { Router } = require('express');
const User = require('../../db/models/User');
const requireAuth = require('../middleware/auth');
const { toPublicUser } = require('../utils/users');

const router = Router();

router.use(requireAuth);
router.get('/', (req, res) => res.json({ user: toPublicUser(req.user) }));

router.patch('/', async (req, res, next) => {
  try {
    const body = req.body || {};
    const updates = {};
    if (typeof body.username === 'string') {
      const username = body.username.trim();
      if (username.length < 3 || username.length > 30) {
        return res.status(400).json({ error: 'Username must be between 3 and 30 characters.' });
      }
      updates.username = username;
    }
    if (typeof body.email === 'string') {
      const email = body.email.trim().toLowerCase();
      if (!/^\S+@\S+\.\S+$/.test(email)) {
        return res.status(400).json({ error: 'Please enter a valid email address.' });
      }
      updates.email = email;
    }
    if (!Object.keys(updates).length) {
      return res.status(400).json({ error: 'Provide a username or email to update.' });
    }

    Object.assign(req.user, updates);
    await req.user.save();
    return res.json({ user: toPublicUser(req.user) });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ error: 'That username or email is already in use.' });
    }
    return next(error);
  }
});

module.exports = router;
