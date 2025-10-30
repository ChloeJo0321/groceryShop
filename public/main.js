// Get db data using fetch


if (path.endsWith("account.html")) {
  console.log("account");
  fetch("/account")
    .then((res) => res.json())
    .then((data) => {
      console.log("data", data);
    });
}
