const db = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const jwtSecret = process.env.JWT_SECRET;

// Task: verifying user
const verifyUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check if the user is in DB
    const query = "select * from users where username=?";
    const [rows] = await db.query(query, [username]);
    // Testing
    // console.log(rows);

    // Case 1) Wrong username/No username found
    if (rows === undefined) {
      return res.status(401).json({
        message: "No username found. Please try again or create an account.",
      });
    }
    // Case 2) Wrong password
    const match = await bcrypt.compare(password, rows["password"]);
    if (!match) {
      return res.status(401).json({
        message: "Incorrect password. Please try again.",
        data: match,
      });
    }
    // Case 3) Signin Success
    // Set a cookie and store it in the browser
    const token = jwt.sign({ id: rows["username"] }, jwtSecret);
    res.cookie("token", token, { httpOnly: true, maxAge: 3600000 });
    console.log("token ", req.body.token);

    return res.json(rows);

    // Testing
    //   const data = { message: "Signin success", data: match };
    //   res.status(200).json(data);
  } catch (err) {
    console.error(err.message);
  }
};

module.exports = {
  verifyUser,
};
