const express = require("express");
const router = express.Router();
const db = require("../config/db");
const path = require("path");
const { authenticateUser } = require("../middleware/authMiddleware");
let isSignedIn = false;

router.get(["/cart", "/cart.html"], authenticateUser, async (req, res) => {
  if (req.isAuthenticated) {
    isSignedIn = true;
    const username = req.user["username"];
    const query = "select * from cart_items where username = ?";
    // Get all cart items with the username
    const userCart = await db.query(query, [username]);
    let products = [];

    // Get product info
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
    console.log("no sign in");
    return res.json({ isSignedIn });
  }
});

// Get user's cart or create one if there's none
router.post("/cart", authenticateUser, async (req, res) => {
  // Find if the user already has a cart with items

  try {
    const product_id = req.body["product_id"];
    const username = req.user["username"];

    // Get user_id using username data
    const [data] = await db.query("select * from users where username=?", [
      username,
    ]);
    const user_id = data["user_id"];

    const res = await db.query("select * from carts where user_id = ?", [
      user_id,
    ]);

    // If no cart found with the user id, create a new cart
    if (res.length === 0)
      await db.query("insert into carts (user_id, username) values(?, ?)", [
        user_id,
        username,
      ]);

    // Find user's cart
    const [cart] = await db.query(
      "select cart_id from carts where user_id = ?",
      [user_id]
    );
    const cart_id = cart["cart_id"];

    // Check if the selected item is already in the user's cart using product_id
    // 1) Y: Update the quantity
    const item = await db.query(
      "select * from cart_items where " + "product_id = ? and username = ? ",
      [product_id, username]
    );

    // Add the item only when it's not in the user's cart
    if (item.length === 0) {
      await db.query(
        "insert into cart_items (cart_id, product_id, username) values(?,?,?)",
        [cart_id, product_id, username]
      );
    }
  } catch (err) {
    {
      console.error(err);
    }
  }
});

// Update the item quantity in the user's cart
router.post("/updateCart", authenticateUser, async (req, res) => {
  if (req.isAuthenticated) {
    // Get new quantity from client
    const { productId, newQty } = req.body;
    const username = req.user["username"];

    if (newQty === 0) {
      await db.query(
        "delete from cart_items where username = ? and product_id = ?",
        [username, productId]
      );
      return res.redirect("/cart.html");
    } else {
      // Update the new quantity in the cart_items
      await db.query(
        "update cart_items set product_quantity = ? where username = ? and product_id = ?",
        [newQty, username, productId]
      );
      // }
    }
  }
});

module.exports = router;
