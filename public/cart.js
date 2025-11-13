import { handleSignOut } from "./signOut.js";

document.addEventListener("DOMContentLoaded", () => {
  fetch("/cart")
    .then((res) => res.json())
    .then((data) => {
      const { products, userCart } = data;

      // Main cart container
      const cart = document.getElementById("cart-container");
      const signInBtn = document.getElementById("sign-in-btn");

      // If user sign in,
      if (products) {
        signInBtn.textContent = "Sign Out";

        // Handle sign out
        signInBtn.addEventListener("click", () => {
          handleSignOut();
        });

        const productCart = document.createElement("div");
        productCart.id = "product-cart";
        const totalPxContainer = document.createElement("div");
        totalPxContainer.id = "total-px-container";
        cart.appendChild(productCart);
        cart.appendChild(totalPxContainer);
        let subTotal = 0.0;
        let taxes = 0.0; // hard-coded for testing
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
          const productNameLink = document.createElement("a");
          const productName = document.createElement("p");
          const productPxContainer = document.createElement("div");
          const productPrice = document.createElement("p");
          const productBtnContainer = document.createElement("div");
          const removeBtn = document.createElement("button");

          productNameLink.href = `/productList/${products[i]["product_id"]}`;
          productNameLink.appendChild(productName);
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
          taxes = subTotal * 0.13;

          total = (subTotal + taxes).toFixed(2);

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
            taxes = subTotal * 0.13;
            total = (subTotal + taxes).toFixed(2);

            subTotalPx.textContent =
              "Subtotal: $" + String(subTotal.toFixed(2));
            totalPx.textContent = "Total: $" + String(total);
            quantityDefault.textContent = quantity;
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
            taxes = subTotal * 0.13;
            total = (subTotal + taxes).toFixed(2);

            subTotalPx.textContent =
              "Subtotal: $" + String(subTotal.toFixed(2));
            totalPx.textContent = "Total: $" + String(total);
            quantityDefault.textContent = quantity;

            if (quantity === 0) {
              // remove item from the cart
              // console.log(i);
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

          productNameContainer.appendChild(productNameLink);
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
        const cartTotal = document.getElementById("cart-total");
        // Display Default subtotal + total
        subTotalPx.textContent = "Subtotal: $" + String(subTotal.toFixed(2));
        tax.textContent = "Taxes: $" + String(taxes);
        totalPx.textContent = "Total: $" + String(total);

        checkoutBtn.textContent = "Continue to checkout";
        checkoutBtn.addEventListener("click", () => {
          window.location.href = "checkout.html";
        });

        // Display total amount in cart
        cartTotal.textContent = "$" + subTotal.toFixed(2);
        totalPxContainer.appendChild(checkoutBtn);
        totalPxContainer.appendChild(subTotalPx);
        totalPxContainer.appendChild(tax);
        totalPxContainer.appendChild(totalPx);
      } else {
        // products = undefined when no sign in
        const emptyMsg = document.createElement("h3");
        emptyMsg.textContent = "Your cart is empty!";
        signInBtn.textContent = "Sign In";
        cart.appendChild(emptyMsg);
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
  }).then((res) => {
    window.location.href = "/cart.html";
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
