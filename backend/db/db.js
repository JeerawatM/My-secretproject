// db.js
const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres", // ชื่อผู้ใช้ PostgreSQL ของคุณ
  host: "localhost", // Host ของ PostgreSQL (ปกติคือ localhost หรือ IP ของเซิร์ฟเวอร์)
  database: "my-secretproject", // ชื่อฐานข้อมูลของคุณ
  password: "Jeerawat0145", // รหัสผ่าน PostgreSQL ของคุณ
  port: 5432, // Port ของ PostgreSQL (ค่าเริ่มต้นคือ 5432)
});

// ตรวจสอบการเชื่อมต่อ
pool.query("SELECT NOW()", (err, res) => {
  if (err) {
    console.error("Error connecting to PostgreSQL:", err.stack);
  } else {
    console.log("Connected to PostgreSQL successfully!");
  }
});

module.exports = pool;
