import {
    db,
    auth,
    doc,
    getDoc,
    setDoc
} from "./firebase.js";

const profileName = document.getElementById("profileName");
const profileEmail = document.getElementById("profileEmail");

const nameInput = document.getElementById("nameInput");
const saveProfile = document.getElementById("saveProfile");

const selectedAvatar =
document.getElementById("selectedAvatar");

const avatars =
document.querySelectorAll(".avatar");

let selectedAvatarPath =
"images/avatars/avatar1.png";
auth.onAuthStateChanged(async(user)=>{

    if(!user){

        window.location.href = "login.html";

        return;

    }

    profileEmail.textContent = user.email;

    const profileRef = doc(
        db,
        "users",
        user.uid
    );

    const profileSnap =
    await getDoc(profileRef);

    if(profileSnap.exists()){

        const data =
        profileSnap.data();

        profileName.textContent =
        data.name;

        nameInput.value =
        data.name;

        if(data.avatar){

            selectedAvatar.src =
            data.avatar;

            selectedAvatarPath =
            data.avatar;

        }

    }

});
// ===============================
// Avatar Selection
// ===============================

avatars.forEach((avatar)=>{

    avatar.onclick = ()=>{

        avatars.forEach((a)=>{

            a.classList.remove("active");

        });

        avatar.classList.add("active");

        selectedAvatar.src = avatar.src;

        // Sirf relative path save karo
        selectedAvatarPath =
        avatar.getAttribute("src");

    };

});
// ===============================
// Save Profile
// ===============================

saveProfile.onclick = async ()=>{

    const user = auth.currentUser;

    if(!user) return;

    const name = nameInput.value.trim();

    if(name===""){

        alert("Please enter your name.");

        return;

    }

    await setDoc(

        doc(db,"users",user.uid),

        {

            name:name,

            email:user.email,

            avatar:selectedAvatarPath

        },

        {

            merge:true

        }

    );

    profileName.textContent = name;

    alert("Profile Updated Successfully 💜");

};
