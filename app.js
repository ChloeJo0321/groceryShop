const express = require("express"); //require("express") = Node.js module
const app = express();
const port = 3000;
const productRouter = require("./routes/productRoute");
const { router: userRouter } = require("./routes/userRoute");
const cartRouter = require("./routes/cartRoute");
const cookieParser = require("cookie-parser");
const { authenticateUser } = require("./middleware/authMiddleware");
const path = require("path");

app.use(express.urlencoded({ extended: true })); //Middleware call for form
app.use(express.json()); //Middleware call for form
app.use(cookieParser());

// Check the sign in status first
app.get(["/", "/index.html"], authenticateUser, (req, res) => {
  // Already sign in
  if (req.isAuthenticated) {
    return res.redirect("/welcome.html");
  }
  // Not sign in yet
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
