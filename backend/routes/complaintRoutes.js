const express = require("express");
const router = express.Router();
const db = require("../models/Complaint");

// Submit complaint
router.post("/submit", (req, res) => {
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

// Admin dashboard
router.get("/admin", (req, res) => {
  db.all("SELECT * FROM complaints", (err, rows) => {
    res.render("admin", { complaints: rows });
  });
});



module.exports = router;
