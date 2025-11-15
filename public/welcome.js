document.addEventListener("DOMContentLoaded", () => {
  fetch("/welcome")
    .then((res) => res.json())
    .then((data) => {
      const cartTotal = document.getElementById("cart-total");
      cartTotal.textContent = "$" + data["total"].toFixed(2);
    });
});
