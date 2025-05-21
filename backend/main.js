// const express = require("express");
// const app = express();
// const port = 3000;

// app.get("/", (req, res) => {
//   res.send("Hello World!!!");
// });

// app.listen(port, () => {
//   console.log(`Example app listening on port ${port}`);
// });
// app.js
const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const pool = require("./db/db.js"); // นำเข้า pool จากไฟล์ db.js ที่สร้างไว้

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Route สำหรับแสดงหน้า Login (ถ้ามี)
app.get("/login", (req, res) => {
  res.send("หน้า Login"); // หรือ render ไฟล์ HTML
});

// Route สำหรับจัดการการ Login
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  // ตรวจสอบว่ามี username และ password ใน request หรือไม่
  if (!username || !password) {
    return res.status(400).json({ message: "กรุณากรอกชื่อผู้ใช้และรหัสผ่าน" });
  }

  try {
    // 1. ค้นหาผู้ใช้จากฐานข้อมูลด้วย username
    const result = await pool.query("SELECT * FROM users WHERE username = $1", [
      username,
    ]);
    const user = result.rows[0]; // PostgreSQL จะคืนค่าใน result.rows

    if (!user) {
      return res.status(401).json({ message: "ชื่อผู้ใช้ไม่ถูกต้อง" });
    }

    // 2. เปรียบเทียบรหัสผ่านที่ผู้ใช้ป้อนกับรหัสผ่านที่เข้ารหัสในฐานข้อมูล
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "รหัสผ่านไม่ถูกต้อง" });
    }

    // 3. ถ้าการตรวจสอบสำเร็จ ให้สร้าง session หรือ token
    // ตัวอย่างการใช้ JWT (แนะนำสำหรับ API)
    // คุณจะต้องติดตั้ง jsonwebtoken: npm install jsonwebtoken
    const jwt = require("jsonwebtoken");
    const token = jwt.sign(
      { userId: user.id, username: user.username },
      "your-secret-key",
      { expiresIn: "1h" }
    );
    return res.status(200).json({ message: "เข้าสู่ระบบสำเร็จ", token });

    // หรือถ้าจะใช้ Session (ต้องใช้ร่วมกับ express-session)
    // require('express-session')
    // app.use(session({
    //   secret: 'your-secret-key',
    //   resave: false,
    //   saveUninitialized: false,
    //   cookie: { secure: false } // ตั้งเป็น true ใน production เมื่อใช้ HTTPS
    // }));
    // req.session.userId = user.id;
    // req.session.username = user.username;
    // return res.status(200).json({ message: 'เข้าสู่ระบบสำเร็จ' });
  } catch (error) {
    console.error("เกิดข้อผิดพลาดในการ Login:", error);
    return res.status(500).json({ message: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์" });
  }
});

// Route สำหรับสมัครสมาชิก (ตัวอย่าง: เพื่อเพิ่มผู้ใช้เข้าไปในฐานข้อมูล)
app.post("/register", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "กรุณากรอกชื่อผู้ใช้และรหัสผ่าน" });
  }

  try {
    // เข้ารหัสรหัสผ่านก่อนบันทึกลงฐานข้อมูล
    const hashedPassword = await bcrypt.hash(password, 10); // 10 คือ salt rounds

    const result = await pool.query(
      "INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id, username",
      [username, hashedPassword]
    );
    const newUser = result.rows[0];
    return res
      .status(201)
      .json({ message: "สมัครสมาชิกสำเร็จ", user: newUser });
  } catch (error) {
    if (error.code === "23505") {
      // รหัสข้อผิดพลาดสำหรับ Unique Violation (username ซ้ำ)
      return res.status(409).json({ message: "ชื่อผู้ใช้นี้มีอยู่แล้ว" });
    }
    console.error("เกิดข้อผิดพลาดในการสมัครสมาชิก:", error);
    return res.status(500).json({ message: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
