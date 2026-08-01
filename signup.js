import {
  auth,
  createUserWithEmailAndPassword
} from "./firebase.js";

const form = document.getElementById("signupForm");

form.addEventListener("submit", async (e) => {

    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    if (name === "") {
        alert("Please enter your full name.");
        return;
    }

    if (password !== confirmPassword) {
        alert("Passwords do not match.");
        return;
    }

    try {

        await createUserWithEmailAndPassword(auth, email, password);

        alert("🎉 Account created successfully!");

        window.location.href = "login.html";

    } catch (error) {

        alert(error.message);

    }

});