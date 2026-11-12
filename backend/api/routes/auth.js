const { Router } = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../../db/models/User');
const requireAuth = require('../middleware/auth');
const { toPublicUser } = require('../utils/users');

const router = Router();
const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

function createToken(user) {
  return jwt.sign({}, process.env.JWT_SECRET, { subject: user.id, expiresIn: '7d' });
}

router.post('/register', async (req, res, next) => {
  try {
    const body = req.body || {};
    const username = typeof body.username === 'string' ? body.username.trim() : '';
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
    const password = typeof body.password === 'string' ? body.password : '';

    if (username.length < 3 || username.length > 30) {
      return res.status(400).json({ error: 'Username must be between 3 and 30 characters.' });
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return res.status(400).json({ error: 'Please enter a valid email address.' });
    }
    if (!passwordPattern.test(password)) {
      return res.status(400).json({
        error: 'Password must be at least 8 characters and include an uppercase letter, a lowercase letter, and a number.'
      });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await User.create({ username, email, passwordHash });
    return res.status(201).json({ token: createToken(user), user: toPublicUser(user) });
  } catch (error) {
    if (error.code === 11000) {
      const field = Object.prototype.hasOwnProperty.call(error.keyPattern || {}, 'email') ? 'email' : 'username';
      return res.status(409).json({ error: `That ${field} is already registered.` });
    }
    return next(error);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const body = req.body || {};
    const login = typeof body.login === 'string' ? body.login.trim() : '';
    const password = typeof body.password === 'string' ? body.password : '';
    const isEmail = login.includes('@');
    const user = await User.findOne(isEmail
      ? { email: login.toLowerCase() }
      : { username: new RegExp(`^${login.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') }
    ).select('+passwordHash');

    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return res.status(401).json({ error: 'Wrong username/email or password.' });
    }
    return res.json({ token: createToken(user), user: toPublicUser(user) });
  } catch (error) {
    return next(error);
  }
});

router.get('/me', requireAuth, (req, res) => {
  res.json({ user: toPublicUser(req.user) });
});

module.exports = router;
