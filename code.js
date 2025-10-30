app.get("/cart", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "cart.html"));
});

app.post("/cart", async (req, res) => {
  const { product_id } = req.body;
  try {
    // Get one product data
    const product = await db.query(
      "Select * from groceries where product_id=?", // ?: parameterized query
      [product_id]
    );
    res.json(product);
    // console.log(product[0]["product_name"]);
  } catch (err) {
    console.log(err);
  }
});
