# The Mystery Fish: clearly separated, commented frontend

This project contains an HTML + CSS + JavaScript frontend and a Node.js +
MongoDB backend. Run the frontend with VS Code + Live Server and the API from
the `backend` folder.

## START HERE (beginner steps)

1. Extract the ZIP file.
2. Open the extracted **MysteryFish** folder in **VS Code**.
3. Install the **Live Server** extension in VS Code if you have not installed it.
4. Right-click **index.html** and select **Open with Live Server**.
5. Start the backend using the instructions below.
6. Choose **Sign Up**, register a test player, then select **Play**.
6. Level 1 starts unlocked. Earn at least 2 stars to unlock Level 2, then Level 3.

## WHICH FILE SHOULD I OPEN OR EDIT?

| What you want to edit | HTML FILE | JavaScript FILE |
|---|---|---|
| Player login | `index.html` | `js/pages/login.js` |
| New player sign-up | `register.html` | `js/pages/register.js` |
| Main menu and game rules | `menu.html` | `js/pages/menu.js` |
| Level selection | `levels.html` | `js/pages/levels.js` |
| Fish guessing game | `game.html` | `js/pages/game.js` |
| Fish API second-chance puzzle | `revival.html` | `js/pages/revival.js` |
| Win / game-over results | `result.html` | `js/pages/result.js` |
| Player details | `profile.html` | `js/pages/profile.js` |
| Leaderboard | `leaderboard.html` | `js/pages/leaderboardPage.js` |
| Colours and visual layout | all pages | `css/style.css` |

## OTHER JAVASCRIPT FILES (game logic)

- `js/fishData.js`: 27 image-based quiz entries with species names, three hints,
  and facts. Every entry uses a photo from `game images/`.
- `js/quiz.js`: randomly orders the fish questions and creates 4 answers.
- `js/score.js`: scoring, three starting lives, and star thresholds.
- `js/gameState.js`: the most important logic: game progress, timer, one revival, saved results.
- `js/fishApi.js`: gets the bonus puzzle from https://marcconrad.com/uob/fish/api.php (JSON/base64 response, 8-second timeout, CSV fallback). If the API cannot be reached, revival.js offers a clearly labelled backup puzzle.
- `js/user.js`: API requests, login token, and cached player profile.
- `js/leaderboard.js`: loads ranked players from the backend.
- `js/common.js`: shared header, login protection, and common helper functions.
- `js/events.js`: simple event bus for game events.

## RULES

- Start each level with 3 lives. Each question has 30 seconds.
- Pick the correct fish from four names and earn 10 points.
- Wrong guess or timeout loses 1 life.
- Once all lives run out, attempt ONE optional Fish API counting puzzle.
- Solve the puzzle: restore exactly 1 life and continue at the NEXT question.
- Fail or skip the puzzle: game over. No score or progress reset on a successful revival.
- Level 1 has 5 questions, Level 2 has 10, and Level 3 has 12. Two stars
  (at least 60% correct) unlock the next level.

## START THE BACKEND

1. Install Node.js 18+ and MongoDB Community Server, or use a MongoDB Atlas
   connection string.
2. Open a terminal in `backend`.
3. Run `npm install`.
4. Copy `.env.example` to `.env`. Set `MONGODB_URI` and replace
   `JWT_SECRET` with a random secret of at least 32 characters.
5. Run `npm start`; the API listens on `http://localhost:3000`.
6. Serve `frontend` using Live Server at `http://127.0.0.1:5500` or
   `http://localhost:5500` (these origins are allowed by default).

## IMPORTANT DETAILS

- Accounts and game results are stored in MongoDB. Passwords are hashed with
  bcrypt in the backend. The browser stores a bearer token and a profile cache;
  the active game remains in `sessionStorage`.
- Do not commit `backend/.env`; it contains the database connection string and
  JWT secret. For production, use HTTPS and a strong, private JWT secret.
- Login, profile, leaderboard, game history, scores, stars, games played, and
  unlocked level data are provided by the API.
- The Fish API puzzle needs internet. If the API is offline, or blocks cross-origin
  browser requests, the page explains the error and offers a retry. Since this is
  a frontend-only project, no backend proxy is provided.
- Open `index.html` through Live Server, not by changing to a different directory.
- The source contains comments above each important area to help with study.
