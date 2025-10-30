const express = require("express");
const router = express.Router();
const db = require("../config/db");
const path = require("path");

router.get("/cart", (req, res) => {
  res.sendFile(path.resolve(__dirname, "..", "public", "cart.html"));
});

router.post("/cart", async (req, res) => {
  // Add selected item to client
  // const id = req.body.product_id;
  // console.log(id);
  // const query = "select * from groceries where product_id = ?";
  // const data = await db.query(query, [id]);
  // return res.json(data);
});
module.exports = router;
