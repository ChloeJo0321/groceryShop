const express = require("express");
const router = express.Router();
const db = require("../config/db");
// const path = require("path");
const { authenticateUser } = require("../middleware/authMiddleware");
const { calculateTotal } = require("./userRoute");
let isSignedIn = false;

router.get(["/cart", "/cart.html"], authenticateUser, async (req, res) => {
  if (req.isAuthenticated) {
    isSignedIn = true;
    const username = req.user["username"];
    const query = "select * from cart_items where username = ?";
    // Get all cart items with the username
    const userCart = await db.query(query, [username]);
    let products = [];

    // Display products in the user's cart
    for (const product of userCart) {
      const product_id = product["product_id"];
      const [res] = await db.query(
        "select * from groceries where product_id=?",
        [product_id]
      );
      products.push(res);
    }
    return res.json({ products, userCart, isSignedIn });
  } else {
    return res.json({ isSignedIn });
  }
});

// Create, update, delete user's cart in DB
router.post("/cart", authenticateUser, async (req, res) => {
  // Find if the user already has a cart with items
  if (req.isAuthenticated) {
    const product_id = req.body["product_id"];
    const username = req.user["username"];

    // Get user info
    const [data] = await db.query("select * from users where username=?", [
      username,
    ]);
    const user_id = data["user_id"];
    const res = await db.query("select * from carts where user_id = ?", [
      user_id,
    ]);

    // Get product info
    const [product] = await db.query(
      "Select * from groceries where product_id = ?",
      [product_id]
    );

    // User has a cart?
    // - If no, create a cart in carts table
    if (res.length === 0)
      await db.query("insert into carts (user_id, username) values(?, ?)", [
        user_id,
        username,
      ]);

    const [cart] = await db.query(
      "select cart_id from carts where user_id = ?",
      [user_id]
    );
    const cart_id = cart["cart_id"];

    const item = await db.query(
      "select * from cart_items where " + "product_id = ? and username = ? ",
      [product_id, username]
    );

    // Add the item only when it's not in the user's cart
    if (item.length === 0) {
      await db.query(
        "insert into cart_items (cart_id, product_id, username, product_price) values(?,?,?,?)",
        [cart_id, product_id, username, product["product_price"]]
      );
    }

    // Update cart total
    let cart_total = 0;
    // Get all items with the current cart_id
    const results = await db.query(
      "select * from cart_items where cart_id = ?",
      [cart_id]
    );
    // Add up all the item_total in cart_items
    results.forEach((product) => {
      cart_total += product["product_price"] * product["product_quantity"];
    });

    // Update cart_total in carts using cart_id
    const total = await db.query(
      "update carts set cart_total = ? where cart_id = ?",
      [parseFloat(cart_total.toFixed(2)), cart_id]
    );
  } else {
    return res.json(isSignedIn);
  }
});

// Update a cart
router.post("/updateCart", authenticateUser, async (req, res) => {
  if (req.isAuthenticated) {
    // - Get new quantity and username from the user
    const { productId, newQty } = req.body;
    const username = req.user["username"];

    // - If the quantity == 0, delete the product
    if (newQty === 0) {
      await db.query(
        "delete from cart_items where username = ? and product_id = ?",
        [username, productId]
      );
      return res.redirect("/cart.html");
    } else {
      // - Else, update new product quantity
      await db.query(
        "update cart_items set product_quantity = ? where username = ? and product_id = ?",
        [newQty, username, productId]
      );
    }
    // - Update new cart total
    const cartTotal = await calculateTotal(username);
    await db.query("update carts set cart_total = ? where username=?", [
      parseFloat(cartTotal.toFixed(2)),
      username,
    ]);
  }
});

module.exports = router;
