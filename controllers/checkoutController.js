const jwt = require("jsonwebtoken");

const authenticateUser = async (req, res) => {
  const token = req.cookies.token;
  //   console.log("Cookie? ", token);
  console.log("Token", token);
  if (!token) {
    req.isAuthenticated = false;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // user login
    req.isAuthenticated = true;
    console.log("Login? ", req.isAuthenticated);
  } catch (err) {
    req.isAuthenticated = false;
  }
};

module.exports = { authenticateUser };
