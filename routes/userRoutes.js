// Users route
const express = require("express");
const router = express.Router();
// const userController = require("../controllers/userController");
// const authMiddleware = require("../middleware/authMiddleware");
const path = require("path");
const db = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const jwtSecret = process.env.JWT_SECRET;
// object destructuring to store the function
const { authenticateUser } = require("../middleware/authMiddleware");

dotenv.config();

// const authMiddleware = require("../middleware/authMiddleware");

// router.use(authMiddleware);
// router.post("/signIn", userController.verifyUser);

router.post("/signIn", async (req, res) => {
  const { username, password } = req.body;
  const query = "select * from users where username = ?";
  const [data] = await db.query(query, [username]);

  //No user found
  if (data == undefined) {
    return res.status(401).json({ message: "No user found" });
  }
  // Incorrect password
  const isMatch = await bcrypt.compare(password, data["password"]);
  if (!isMatch) {
    return res.status(401).json({ message: "Incorrect password" });
  }
  // Signin success
  const token = jwt.sign({ id: data["username"] }, jwtSecret);
  res.cookie("token", token, { httpOnly: true, maxAge: 3600000 });

  return res.json(data);
});

router.post("/signUp", async (req, res) => {
  const { username, email, phonenumber, password, repassword } = req.body;
  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Send form data to db
  const query =
    "insert into users (username, email, phonenumber, password) values(?, ?, ?, ?)";
  db.query(
    query,
    [username, email, phonenumber, hashedPassword],
    (err, res) => {
      if (err) {
        console.error("Error: " + err.stack);
      }
    }
  );
  res.redirect("/index.html");
});

router.get("/account", authenticateUser, async (req, res) => {
  const username = req.user["id"];
  const query = "select * from users where username = ?";
  const [data] = await db.query(query, [username]);
  return res.json(data);
});

module.exports = router;
