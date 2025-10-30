const jwt = require("jsonwebtoken");

const authenticateUser = (req, res, next) => {
  const token = req.cookies.token;

  //   console.log("Cookie? ", token);
  //   console.log(token);
  if (!token) {
    req.isAuthenticated = false;
    // console.log(req.isAuthenticated);
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // user login

    // Update login status
    req.isAuthenticated = true;
  } catch (err) {
    req.isAuthenticated = false;
  }
  next();
};

module.exports = { authenticateUser };
