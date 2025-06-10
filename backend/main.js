const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql2");
const cors = require("cors");
const app = express();

app.use(bodyParser.json());
app.use(cors());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "finance_tracker",
});

db.connect((err) => {
  if (err) throw err;
  console.log("Connected to database");
});

// Create table
const createTableQuery = `
CREATE TABLE IF NOT EXISTS transactions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  type ENUM('income', 'expense') NOT NULL,
  title VARCHAR(255) NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  spend_date DATE NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)`;
db.query(createTableQuery, (err) => {
  if (err) throw err;
  console.log("Table ensured");
});

app.post("/api/transactions", (req, res) => {
  const { type, title, amount, spend_date } = req.body;
  const query =
    "INSERT INTO transactions (type, title, amount, spend_date) VALUES (?, ?, ?, ?)";
  db.query(query, [type, title, amount, spend_date], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ id: result.insertId });
  });
});

app.put("/api/transactions/:id", (req, res) => {
  const { id } = req.params;
  const { type, title, amount, spend_date } = req.body;
  const query =
    "UPDATE transactions SET type=?, title=?, amount=?, spend_date=? WHERE id=?";
  db.query(query, [type, title, amount, spend_date, id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Transaction updated" });
  });
});

// Delete transaction
app.delete("/api/transactions/:id", (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM transactions WHERE id = ?", [id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Transaction deleted" });
  });
});

app.get("/api/transactions/", (req, res) => {
  const query = `SELECT * FROM transactions`;
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Get transactions by month
app.get("/api/transactions/:year/:month", (req, res) => {
  const { year, month } = req.params;
  const query = `SELECT * FROM transactions WHERE YEAR(spend_date) = ? AND MONTH(spend_date) = ? ORDER BY spend_date`;
  db.query(query, [year, month], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Get monthly report summary
app.get("/api/report/:year/:month", (req, res) => {
  const { year, month } = req.params;
  const query = `
    SELECT 
      SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) AS total_income,
      SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) AS total_expense,
      SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) - 
      SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) AS balance
    FROM transactions
    WHERE YEAR(spend_date) = ? AND MONTH(spend_date) = ?`;

  db.query(query, [year, month], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results[0]);
  });
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
