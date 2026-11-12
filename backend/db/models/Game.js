const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  gameId: { type: String, required: true },
  level: { type: Number, required: true, min: 1, max: 3 },
  score: { type: Number, required: true, min: 0 },
  stars: { type: Number, required: true, min: 0, max: 3 },
  correct: { type: Number, required: true, min: 0 },
  totalQuestions: { type: Number, required: true, min: 1 },
  status: { type: String, enum: ['complete', 'gameover'], required: true }
}, { timestamps: true });

gameSchema.index({ user: 1, gameId: 1 }, { unique: true });
gameSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('Game', gameSchema);
