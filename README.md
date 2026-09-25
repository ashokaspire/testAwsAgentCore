# Asteroid Blaster

A classic Asteroids-inspired browser game with persistent high scores.

## How to run

```bash
npm install --production
PORT=3000 node server.js
```

Open `http://localhost:3000` in a browser. The server stays in the foreground.
The `PORT` environment variable controls the listen port (default: 3000).

## How to play

- **Left / Right arrows** — Rotate the ship
- **Up arrow** — Thrust forward
- **Space** — Fire bullets
- **R** — Restart after game over

Destroy asteroids by shooting them. Large asteroids split into two medium ones when hit;
medium asteroids split into two small ones; small asteroids are destroyed completely.
Each asteroid destroyed (any size) earns **1 point**. The game ends when an asteroid
collides with your ship. Clearing all asteroids spawns a new, larger wave with brief
invulnerability.

After game over, enter your name and save your score to the persistent leaderboard.
Press R to start a new round.

## Scoring

Score equals the total number of asteroids destroyed during a round. Splitting a large
asteroid into two mediums counts as 1 point (the large one destroyed). Destroying a
small asteroid also counts as 1 point. Higher scores come from surviving longer and
clearing more waves.

## API

| Method | Path     | Description            |
|--------|----------|------------------------|
| GET    | /scores  | Top 20 scores (JSON)   |
| POST   | /scores  | Save a score           |

**POST /scores** body: `{ "name": "string (1-20 chars)", "score": integer (0-100000) }`

Returns 201 on success, 400 with `{ "error": "..." }` on validation failure.

## Architecture

- **Server**: Node.js + Express, serves static files and the scores API
- **Database**: SQLite via better-sqlite3 — scores survive server restarts
- **Game**: HTML5 Canvas rendered in the browser, all assets inline
- **URLs**: All relative — works behind a reverse proxy with a path prefix

## Hosting notes

- No external CDN, fonts, or third-party scripts
- No cookies, localStorage, or sessionStorage required
- CORS enabled for cross-origin requests including preflight
- Form submission handled via JavaScript fetch (no native form navigation)
