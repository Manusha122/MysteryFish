# Mystery Fish backend

Express API with MongoDB/Mongoose persistence for player accounts, profiles,
game history, scores, stars, level progress, and the leaderboard.

## Setup

1. Install Node.js 18+ and run `npm install` in this folder.
2. Copy `.env.example` to `.env`.
3. Set `MONGODB_URI` to a local MongoDB URL or MongoDB Atlas connection string.
4. Replace `JWT_SECRET` with a random secret of at least 32 characters.
5. Run `npm start`.
6. Open `http://localhost:3000/api/health` to check the API.

The frontend must be served from Live Server at `localhost:5500` or
`127.0.0.1:5500`. Set `FRONTEND_ORIGIN` to a comma-separated list if the
frontend is hosted elsewhere.

## API

All responses are JSON. Protected endpoints require
`Authorization: Bearer <token>`.

| Method | Path | Purpose |
|---|---|---|
| POST | `/api/auth/register` | Register and sign in |
| POST | `/api/auth/login` | Sign in with username or email |
| GET | `/api/auth/me` | Get the signed-in profile |
| GET | `/api/profile` | Read profile and progress |
| PATCH | `/api/profile` | Update username and/or email |
| POST | `/api/games` | Save a completed or lost game (idempotent by `gameId`) |
| GET | `/api/games/mine` | Read recent game history |
| GET | `/api/leaderboard` | Get the top 50 players |

Game score, stars, played count, per-level bests, and level unlocks are updated
by the server when a result is saved.
