document.addEventListener("DOMContentLoaded", () => {
  fetch("/welcome")
    .then((res) => res.json())
    .then((data) => {
      console.log(data["total"]);
      const cartTotal = document.getElementById("cart-total");
      cartTotal.textContent = "$" + data["total"];
    });
});
