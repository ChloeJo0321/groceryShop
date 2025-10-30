document.addEventListener("DOMContentLoaded", () => {
  document.querySelector("form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const usernameInput = document.getElementById("username").value;
    const passwordInput = document.getElementById("password").value;

    fetch("/signIn", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({
        username: usernameInput,
        password: passwordInput,
      }),
    })
      .then((res) => res.json()) // Convert JSON string to JS object
      .then((data) => {
        // Signin success
        if (data["username"]) {
          window.location.href = "/welcome.html";
        } else {
          // Signin Failure
          const errorMsg = document.getElementById("error-msg");
          errorMsg.textContent = data.message;
          // data.message
          // data = json object
          // message = custom property
        }
      });
    // if (!res.ok) {
    //   console.log(res);
    // }

    // No user found
    // if (userData.length === 0) {
    //   const userNameContainer =
    //     document.getElementById("username-container");
    //   const noUserFoundMsg = document.createElement("span");
    //   noUserFoundMsg.textContent =
    //     "No user found. Please create an account";
    //   userNameContainer.appendChild(noUserFoundMsg);
    //   console.log("Not found");
    // } else {
    // }
  });

  const signUpBtn = document.getElementById("sign-up-btn");
  signUpBtn.addEventListener("click", () => {
    window.location.href = "form.html";
  });
});

function showPassword() {
  let passwordInput = document.getElementById("password");
  if (passwordInput.type == "password") {
    passwordInput.type = "text";
  } else {
    passwordInput.type = "password";
  }
}
// document.addEventListener("DOMContentLoaded", () => {
//   document.querySelector("form").addEventListener("submit", async (e) => {
//     e.preventDefault();

//     const usernameInput = document.getElementById("username").value;
//     const passwordInput = document.getElementById("password").value;
//     fetch("/signUp", {
//       method: "POST",
//       headers: { "Content-type": "application/json" },
//       body: JSON.stringify({
//         username: usernameInput,
//         password: passwordInput,
//       }),
//     })
//       .then((res) => res.json()) // Convert JSON string to JS object
//       .then((data) => {});
//     // if (!res.ok) {
//     //   console.log(res);
//     // }

//     // No user found
//     // if (userData.length === 0) {
//     //   const userNameContainer =
//     //     document.getElementById("username-container");
//     //   const noUserFoundMsg = document.createElement("span");
//     //   noUserFoundMsg.textContent =
//     //     "No user found. Please create an account";
//     //   userNameContainer.appendChild(noUserFoundMsg);
//     //   console.log("Not found");
//     // } else {
//     // }
//   });
// });
