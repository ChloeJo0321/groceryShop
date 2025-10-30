const express = require("express"); //require("express") = Node.js module
const app = express();
const port = 3000;
const productRouter = require("./routes/productRoute");
const userRouter = require("./routes/userRoutes");
const cartRouter = require("./routes/cartRoute");
const cookieParser = require("cookie-parser");
const { authenticateUser } = require("./middleware/authMiddleware");
const path = require("path");

app.use(express.urlencoded({ extended: true })); //Middleware call for form
app.use(express.json()); //Middleware call for form
app.use(cookieParser());

// Check the login status first
app.get("/", authenticateUser, (req, res) => {
  // Already login
  if (req.isAuthenticated) {
    return res.redirect("/welcome.html");
  }

  // Not login yet
  return res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Middleware
app.use(express.static("public")); //Middleware to serve static files

app.use("/", productRouter);
app.use("/", userRouter);
app.use("/", cartRouter);
// app.use(authMiddleware);

//Start the server
app.listen(port, () => {
  console.log("Server is running");
});
