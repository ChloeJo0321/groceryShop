// Rendering cart items
// if (path.endsWith("cart.html")) {
document.addEventListener("DOMContentLoaded", () => {
  fetch("/cart")
    .then((res) => res.json())
    .then((data) => {
      const { products, userCart } = data;
      console.log("client says ", products.length);
      // const products = JSON.parse(localStorage.getItem("productsArr"));
      const cart = document.getElementById("cart-container");

      if (products.length === 0) {
        console.log("empty cart");
        const emptyMsg = document.createElement("h3");
        emptyMsg.textContent = "Your cart is empty!";
        cart.appendChild(emptyMsg);
      } else {
        const productCart = document.createElement("div");
        productCart.id = "product-cart";
        const totalPxContainer = document.createElement("div");
        totalPxContainer.id = "total-px-container";
        cart.appendChild(productCart);
        cart.appendChild(totalPxContainer);
        let subTotal = 0.0;
        let taxRate = 0.13; // hard-coded for testing
        let total = 0.0;

        for (let i = 0; i < products.length; i++) {
          // Rendering product info
          const name = products[i]["product_name"];
          const price = products[i]["product_price"];
          const pic = products[i]["product_pic"];
          let quantity = userCart[i]["product_quantity"];

          // HTML tags for rendering each product
          const product = document.createElement("div");
          const productDescContainer = document.createElement("div");

          const productImg = document.createElement("img");
          const productNameContainer = document.createElement("div");
          const productName = document.createElement("p");
          const productPxContainer = document.createElement("div");
          const productPrice = document.createElement("p");
          const productBtnContainer = document.createElement("div");
          const removeBtn = document.createElement("button");

          // Tags to adjust quantity
          const quantityContainer = document.createElement("div");
          quantityContainer.id = "quantity-container";
          const quantityDefaultContainer = document.createElement("div");
          const quantityDefault = document.createElement("span");
          const quantityPlusBtnContainer = document.createElement("div");
          const quantityPlusBtn = document.createElement("button");
          const quantityMinusBtnContainer = document.createElement("div");
          const quantityMinusBtn = document.createElement("button");

          quantityDefault.textContent = quantity;
          quantityDefault.id = "product-quantity";
          quantityMinusBtn.textContent = "-";
          quantityPlusBtn.textContent = "+";

          subTotal += quantity * price;
          total = (subTotal * (1 + taxRate)).toFixed(2);

          // Update quantity: +
          quantityPlusBtn.addEventListener("click", () => {
            quantity++;
            // Add and update quantity
            products[i]["product_quantity"] = quantity;

            // Update quantity in cart_items DB
            updateQuantity(
              products[i]["product_id"],
              products[i]["product_quantity"]
            );
            // Recalculate subtotal, total
            subTotal += price;
            total = (subTotal * (1 + taxRate)).toFixed(2);

            subTotalPx.textContent = "Subtotal: " + String(subTotal.toFixed(2));
            totalPx.textContent = "Total: " + String(total);
            quantityDefault.textContent = quantity;

            // Update quantity in localStorage
            localStorage.setItem("productsArr", JSON.stringify(products));
          });

          // Update quantity: -
          quantityMinusBtn.addEventListener("click", () => {
            quantity--;

            // Update quantity
            products[i]["product_quantity"] = quantity;

            // Update quantity in cart_items DB
            updateQuantity(
              products[i]["product_id"],
              products[i]["product_quantity"]
            );

            // Recalculate subtotal, total
            subTotal -= price;
            total = (subTotal * (1 + taxRate)).toFixed(2);

            subTotalPx.textContent = "Subtotal: " + String(subTotal.toFixed(2));
            totalPx.textContent = "Total: " + String(total);
            quantityDefault.textContent = quantity;

            // Update quantity in localStorage
            localStorage.setItem("productsArr", JSON.stringify(products));

            if (quantity === 0) {
              // remove item from the cart
              console.log(i);
              removeItem(products, i);
            }
          });

          quantityDefaultContainer.appendChild(quantityDefault);
          quantityPlusBtnContainer.appendChild(quantityPlusBtn);
          quantityMinusBtnContainer.appendChild(quantityMinusBtn);

          quantityContainer.appendChild(quantityMinusBtnContainer);
          quantityContainer.appendChild(quantityDefaultContainer);
          quantityContainer.appendChild(quantityPlusBtnContainer);

          product.id = "product-row";
          productImg.src = pic;
          productImg.width = 25;
          productImg.height = 70;
          productName.textContent = name;
          productPrice.textContent = price;
          removeBtn.textContent = "Remove";

          productNameContainer.appendChild(productName);
          productNameContainer.className = "product-desc";
          productPxContainer.appendChild(productPrice);
          productPxContainer.className = "product-desc";
          productBtnContainer.appendChild(removeBtn);
          productBtnContainer.className = "product-desc";

          productDescContainer.className = "product-desc-row";
          productDescContainer.appendChild(productNameContainer);
          productDescContainer.appendChild(productPxContainer);
          productDescContainer.appendChild(productBtnContainer);

          product.appendChild(productImg);
          product.appendChild(productDescContainer);
          product.appendChild(quantityContainer);

          productCart.appendChild(product);

          // Remove the current item when clicked
          removeBtn.addEventListener("click", () => {
            removeItem(products, i);
          });
        }

        // Display subtotal & total
        const subTotalPx = document.createElement("p");
        const tax = document.createElement("p");
        const totalPx = document.createElement("p");
        const checkoutBtn = document.createElement("button");

        // Display Default subtotal + total
        subTotalPx.textContent = "Subtotal: " + String(subTotal.toFixed(2));
        tax.textContent = "Taxes: " + String(taxRate);
        totalPx.textContent = "Total: " + String(total);

        checkoutBtn.textContent = "Continue to checkout";
        checkoutBtn.addEventListener("click", () => {
          window.location.href = "checkout.html";
        });

        totalPxContainer.appendChild(checkoutBtn);
        totalPxContainer.appendChild(subTotalPx);
        totalPxContainer.appendChild(tax);
        totalPxContainer.appendChild(totalPx);
      }
    })
    .catch((err) => console.error(err));
});

function updateQuantity(productId, newQty) {
  fetch("/updateCart", {
    method: "POST",
    headers: { "Content-type": "application/json" },
    body: JSON.stringify({
      productId: productId,
      newQty: newQty,
    }),
  });
}

// Function for guest user to temporarily store items in cart
function removeItem(products, idx) {
  // console.log(productName.textContent);
  // const products = JSON.parse(localStorage.getItem("productArr"));
  // products.splice(idx, 1);
  // console.log(products);
  // // localStorage.setItem("productsArr", JSON.stringify(products));
  // // Reload the page to reflect the change
  // window.location.href = "cart.html";
}
