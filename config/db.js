const mysql = require("mysql"); // cf) mysql2 is faster, secure than mysql
const dotenv = require("dotenv");
const path = require("path");
const util = require("util");

// Connect to mySQL db
dotenv.config({ path: path.resolve(__dirname, ".env") });
console.log(path.join(__dirname, ".env"));
// Connect the DB using require("mysql")
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});
db.connect((err) => {
  if (err) throw err;
  console.log("Connected");
  return;
});

db.query = util.promisify(db.query);

module.exports = db;
