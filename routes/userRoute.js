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

// User controllers
// const authMiddleware = require("../middleware/authMiddleware");

// router.use(authMiddleware);
// router.post("/signIn", userController.verifyUser);

// Sign in
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
  // Create a token when signin success
  const token = jwt.sign({ username: data["username"] }, jwtSecret);
  res.cookie("token", token, {
    httpOnly: true,
    maxAge: 3600000,
  });

  const total = await calculateTotal(username);
  return res.json({ data: data, total: total });
});

// Sign up
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

// Sign out
router.get("/signOut", async (req, res) => {
  res.clearCookie("token");
  return res.json({ message: "coockie cleared" });
});

// Send user information for account
router.get("/account", authenticateUser, async (req, res) => {
  const username = req.user["username"];
  const query = "select * from users where username = ?";
  const [data] = await db.query(query, [username]);
  return res.json(data);
});

// Calculate user's cart total upon sign in
router.get("/welcome", authenticateUser, async (req, res) => {
  const username = req.user["username"];

  const total = await calculateTotal(username);
  return res.json({ total });
});

async function calculateTotal(username) {
  const query = "Select * from cart_items where username = ?";
  const data = await db.query(query, [username]);
  let total = 0.0;

  data.forEach((item) => {
    total += item["product_price"] * item["product_quantity"];
  });
  return total;
}
module.exports = router;
