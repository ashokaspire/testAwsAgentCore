const express = require("express");
const cors = require("cors");
const path = require("path");
const Database = require("better-sqlite3");

const PORT = parseInt(process.env.PORT, 10) || 3000;
const DB_PATH = path.join(__dirname, "scores.db");

const db = new Database(DB_PATH);
db.pragma("journal_mode = WAL");
db.exec(`
  CREATE TABLE IF NOT EXISTS scores (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    score INTEGER NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  )
`);

const insertScore = db.prepare(
  "INSERT INTO scores (name, score) VALUES (@name, @score)"
);
const topScores = db.prepare(
  "SELECT name, score, created_at FROM scores ORDER BY score DESC, created_at ASC LIMIT 20"
);

const app = express();

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
  })
);

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.get("/scores", (_req, res) => {
  const rows = topScores.all();
  res.json(rows);
});

app.post("/scores", (req, res) => {
  const { name, score } = req.body || {};

  if (typeof name !== "string" || name.trim().length === 0) {
    return res.status(400).json({ error: "name is required and must be a non-empty string" });
  }
  if (name.trim().length > 20) {
    return res.status(400).json({ error: "name must be 20 characters or fewer" });
  }
  if (typeof score !== "number" || !Number.isInteger(score) || score < 0) {
    return res.status(400).json({ error: "score must be a non-negative integer" });
  }
  if (score > 999999999) {
    return res.status(400).json({ error: "score exceeds maximum allowed value" });
  }

  const trimmed = name.trim();
  const result = insertScore.run({ name: trimmed, score });
  res.status(201).json({ id: result.lastInsertRowid, name: trimmed, score });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Asteroid Blaster running on http://localhost:${PORT}`);
});
