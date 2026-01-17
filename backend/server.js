const express = require("express");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();

const app = express();
const PORT = process.env.PORT || 5000;

// middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "../frontend/public")));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../frontend/views"));

// DB (absolute path)
const dbPath = path.join(__dirname, "database", "complaints.db");
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) console.error(err);

  console.log("SQLite database connected");
});

// HOME
app.get("/", (req, res) => {
  res.render("citizen");
});

// SUBMIT
app.post("/submit", (req, res) => {
  const { issueType, area, severity, impact } = req.body;

  const score = severity * 10 + impact * 5;
  let priority = "Low";
  if (score > 70) priority = "High";
  else if (score > 40) priority = "Medium";

  db.run(
    `INSERT INTO complaints 
    (issueType, area, severity, impact, score, priority, status, date)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      issueType,
      area,
      severity,
      impact,
      score,
      priority,
      "Work In Progress",
      new Date().toLocaleDateString()
    ],
    () => res.redirect("/admin")
  );
});

// ADMIN
app.get("/admin", (req, res) => {
  const filter = req.query.status;

  let query = "SELECT * FROM complaints";
  let params = [];

  if (filter) {
    query += " WHERE status = ?";
    params.push(filter);
  }

  db.all(query, params, (err, rows) => {
    res.render("admin", {
      complaints: rows || [],
      selectedStatus: filter || ""
    });
  });
});


// 🔥 ANALYSIS (SAFE ROUTE)
app.get("/analysis", (req, res) => {
  db.all(
    "SELECT priority, COUNT(*) as count FROM complaints GROUP BY priority",
    (err, rows) => {
      console.log("ANALYSIS DATA:", rows); // 👈 DEBUG
      res.render("analysis", { chartData: rows || [] });
    }
  );
});
// UPDATE STATUS
app.post("/update-status", (req, res) => {
  const { id, status } = req.body;

  db.run(
    "UPDATE complaints SET status = ? WHERE id = ?",
    [status, id],
    () => {
      res.redirect("/admin");
    }
  );
});


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});