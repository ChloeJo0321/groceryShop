const path = window.location.pathname;
// This console mssg appears in the browser console
// List all produce
if (path.endsWith("productList.html")) {
  fetch("/productList")
    .then((res) => res.json())
    .then((products) => {
      // Display all products
      const mainContainer = document.getElementById("products");
      var productData = products;
      var count = 0;
      for (var i = 0; i < productData.length; i++) {
        // Create a new product item with product image and product name
        if (count === 0) {
          var row = document.createElement("div");
          row.className = "product-row";
        }
        const item = document.createElement("a");
        item.href = `/productList/${productData[i]["product_id"]}`;

        const img = document.createElement("img");
        img.src = productData[i]["product_pic"];
        img.width = 80;
        img.height = 100;
        const newLine = document.createElement("br");
        const productName = document.createElement("p");
        productName.textContent = productData[i]["product_name"];
        item.appendChild(img);
        item.appendChild(newLine);
        item.appendChild(productName);
        count++;

        // Add current item to the row
        row.appendChild(item);
        //
        if (count === 4) {
          // Display 4 items in a row
          mainContainer.appendChild(row);
          count = 0;
        }
      }
    })
    .catch((err) => {
      console.error(err);
    });
}

// Get product id from the current path
const currentPath = window.location.pathname.split("/");
const id = currentPath[2];

// let products = JSON.parse(localStorage.getItem("productsArr")) || [];
// localStorage.setItem("productsArr", JSON.stringify(products));
if (currentPath[1] == "productList") {
  fetch(`/api/productList/${id}`)
    .then((res) => res.json())
    .then((product) => {
      // Rendering product details
      console.log("this is data");
      const data = product[0];
      const name = data["product_name"];
      const price = data["product_price"];
      const pic = data["product_pic"];

      const productContainer = document.getElementById("product-container");
      const productImg = document.createElement("img");

      const productTextContainer = document.createElement("div");
      const productName = document.createElement("h1");
      const productPrice = document.createElement("p");
      const productDesc = document.createElement("p");
      const btnContainer = document.createElement("div");
      const addToCartBtn = document.createElement("button");

      productImg.src = pic;
      productName.textContent = name;
      productPrice.textContent = "$" + price;
      productDesc.textContent = data["product_details"];

      btnContainer.className = "btn-container";
      addToCartBtn.textContent = "Add to Cart";
      addToCartBtn.id = "btn-cart";

      btnContainer.appendChild(addToCartBtn);
      productTextContainer.appendChild(productName);
      productTextContainer.appendChild(productPrice);
      productTextContainer.appendChild(productDesc);
      productTextContainer.appendChild(btnContainer);

      productContainer.appendChild(productImg);
      productContainer.appendChild(productTextContainer);

      // Add an item to cart
      addToCartBtn.addEventListener("click", () => {
        data["product_quantity"] = 1;
        console.log(data);
        products = JSON.parse(localStorage.getItem("productsArr"));

        let isDuplicate = false;
        for (let i = 0; i < products.length; i++) {
          if (data["product_name"] == products[i]["product_name"]) {
            isDuplicate = true;
          }
        }
        if (!isDuplicate) {
          addToCartBtn.textContent = "Added";
          products.push(data);
          localStorage.setItem("productsArr", JSON.stringify(products));
        } else {
          addToCartBtn.textContent = "Already added";
        }
      });
    });
}
