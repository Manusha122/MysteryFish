const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 30
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  passwordHash: {
    type: String,
    required: true,
    select: false
  },
  highScore: { type: Number, default: 0 },
  level: { type: Number, default: 1, min: 1, max: 3 },
  gamesPlayed: { type: Number, default: 0 },
  best: { type: Map, of: Number, default: () => new Map() },
  stars: { type: Map, of: Number, default: () => new Map() }
}, { timestamps: true });

userSchema.index({ username: 1 }, { unique: true, collation: { locale: 'en', strength: 2 } });
userSchema.index({ email: 1 }, { unique: true });

module.exports = mongoose.model('User', userSchema);
