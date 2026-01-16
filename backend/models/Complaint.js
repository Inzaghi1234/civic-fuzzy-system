const sqlite3 = require("sqlite3").verbose();
const path = require("path");

// Absolute path (safe)
const dbPath = path.join(__dirname, "../database/complaints.db");

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("DB connection error:", err.message);
  } else {
    console.log("SQLite database connected");
  }
});

db.run(`
CREATE TABLE IF NOT EXISTS complaints (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  issueType TEXT,
  area TEXT,
  severity INTEGER,
  impact INTEGER,
  score INTEGER,
  priority TEXT,
  status TEXT,
  date TEXT
)
`);

module.exports = db;
