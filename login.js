import {
  auth,
  signInWithEmailAndPassword
} from "./firebase.js";

const form = document.getElementById("loginForm");

form.addEventListener("submit", async (e) => {

    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    try {

      await signInWithEmailAndPassword(auth, email, password);

alert("🎉 Login Successful!");

if (email === "littleayys93@gmail.com") {

    window.location.href = "admin.html";

} else {

    window.location.href = "index.html";

}

    } catch (error) {

        alert("Login failed: " + error.message);

    }

});