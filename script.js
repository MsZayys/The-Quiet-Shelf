import {
    auth,
    onAuthStateChanged,
    signOut,
    db,
    doc,
    getDoc
} from "./firebase.js";

// Elements
const profileLink = document.getElementById("profileLink");
const accountBtn = document.getElementById("accountBtn");
const dropdownMenu = document.getElementById("dropdownMenu");

const accountName = document.getElementById("accountName");
const userName = document.getElementById("userName");
const userEmail = document.getElementById("userEmail");

const loginLink = document.getElementById("loginLink");
const signupLink = document.getElementById("signupLink");

const libraryLink = document.getElementById("libraryLink");
const bookmarkLink = document.getElementById("bookmarkLink");
const adminLink = document.getElementById("adminLink");
const logoutLink = document.getElementById("logoutLink");

// =======================
// Dropdown
// =======================

accountBtn.addEventListener("click", (e) => {

    e.stopPropagation();

    dropdownMenu.classList.toggle("show");

});

document.addEventListener("click", () => {

    dropdownMenu.classList.remove("show");

});

// =======================
// Login Status
// =======================
onAuthStateChanged(auth, async (user) => {

    if(user){

        const profileRef = doc(
            db,
            "users",
            user.uid
        );

        const profileSnap =
        await getDoc(profileRef);

        let name =
        user.email.split("@")[0];

        let avatar =
        "images/default-user.png";

        if(profileSnap.exists()){

            const data =
            profileSnap.data();

            if(data.name){

                name = data.name;

            }

            if(data.avatar){

                avatar = data.avatar;

            }
console.log("Avatar Path:", avatar);

const navbarAvatar = document.getElementById("navbarAvatar");
const dropdownAvatar = document.getElementById("dropdownAvatar");

console.log("Navbar Element:", navbarAvatar);
console.log("Dropdown Element:", dropdownAvatar);
        }
        

        accountName.textContent = name;

        userName.textContent = name;

        userEmail.textContent = user.email;

// Navbar Avatar
const navbarAvatar = document.getElementById("navbarAvatar");
const dropdownAvatar = document.getElementById("dropdownAvatar");

if (navbarAvatar) {
    navbarAvatar.src = avatar;
}

if (dropdownAvatar) {
    dropdownAvatar.src = avatar;
}
loginLink.style.display = "none";
signupLink.style.display = "none";

profileLink.style.display = "flex";
libraryLink.style.display = "flex";
bookmarkLink.style.display = "flex";
logoutLink.style.display = "flex";
        if(user.email==="littlezayys93@gmail.com"){

            adminLink.style.display = "flex";

        }

    }

    else{
        const navbarAvatar = document.getElementById("navbarAvatar");
const dropdownAvatar = document.getElementById("dropdownAvatar");

if (navbarAvatar) {
    navbarAvatar.src = "images/default-user.png";
}

if (dropdownAvatar) {
    dropdownAvatar.src = "images/default-user.png";
}

        accountName.textContent = "Account";

        userName.textContent = "Guest";

        userEmail.textContent = "Please Login";

        loginLink.style.display = "flex";

signupLink.style.display = "flex";

profileLink.style.display = "none";

libraryLink.style.display = "none";

bookmarkLink.style.display = "none";

adminLink.style.display = "none";

logoutLink.style.display = "none";
    }

});

// =======================
// Logout
// =======================

logoutLink.addEventListener("click", (e) => {

    e.preventDefault();

    signOut(auth);

});