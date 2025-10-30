const express = require("express");
const router = express.Router();
const path = require("path");
const db = require("../config/db");

// Display html files

// Routing to process query and send data as JSON

router.get("/productList", async (req, res) => {
  try {
    // Get all products data
    const products = await db.query("Select * from groceries");
    return res.json(products);
  } catch (err) {
    console.log(err);
  }
});

// /produceList/:id - Render the id data (Same endpoint can be used only once!)
router.get("/productList/:id", (req, res) => {
  //   console.log(__dirname);
  console.log(path.resolve(__dirname, "..", "public", "product.html"));
  //   res.sendFile(path.join(__dirname, "public", "produce.html"));
  res.sendFile(path.resolve(__dirname, "..", "public", "product.html"));
});

// /api/produceList/:id - Provide dynamic data
router.get("/api/productList/:id", async (req, res) => {
  // Get product id
  const id = req.params.id;

  try {
    // Get one product data
    const product = await db.query(
      "Select * from groceries where product_id=?", // ?: parameterized query
      [id]
    );
    return res.json(product);
    // console.log(product[0]["product_name"]);
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
