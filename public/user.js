import { handleSignOut } from "./signOut.js";

document.addEventListener("DOMContentLoaded", () => {
  // Handles sign in
  const signInForm = document.querySelector("form");
  if (signInForm) {
    signInForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const username = document.getElementById("username").value;
      const password = document.getElementById("password").value;

      fetch("/signIn", {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      })
        .then((res) => res.json()) // Convert JSON string to JS object
        .then((data) => {
          // Signin success
          if (data.data["username"]) {
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
    });
  }

  // Handles sign up
  const signUpBtn = document.getElementById("sign-up-btn");
  if (signUpBtn) {
    signUpBtn.addEventListener("click", () => {
      window.location.href = "form.html";
    });
  }

  // Handles sign out
  const signInBtn = document.getElementById("sign-in-btn");
  if (signInBtn.textContent == "Sign Out") {
    signInBtn.addEventListener("click", () => {
      // e.preventDefault();
      handleSignOut();
    });
  }
});

window.showPassword = function () {
  let passwordInput = document.getElementById("password");
  if (passwordInput.type == "password") {
    passwordInput.type = "text";
  } else {
    passwordInput.type = "password";
  }
};
