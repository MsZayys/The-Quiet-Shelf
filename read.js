import {
    db,
    auth,
    checkLogin,
    doc,
    setDoc,
    getDoc,
    deleteDoc,
    collection,
    getDocs,
    addDoc,
    serverTimestamp,
    updateDoc
} from "./firebase.js";

// ===============================
// Get Novel ID
// ===============================

const params = new URLSearchParams(window.location.search);
const novelId = params.get("id");

// ===============================
// Elements
// ===============================

const novelCover = document.getElementById("novelCover");
const novelTitle = document.getElementById("novelTitle");
const novelGenre = document.getElementById("novelGenre");
const novelDescription = document.getElementById("novelDescription");
const totalChapters = document.getElementById("totalChapters");
const novelStatus = document.getElementById("novelStatus");
const novelRating = document.getElementById("novelRating");
const novelReads = document.getElementById("novelReads");
const chapterContainer = document.getElementById("chapterContainer");
const chapterTitle = document.getElementById("chapterTitle");
const storyText = document.getElementById("storyText");

const prevBtn = document.getElementById("prevChapter");
const nextBtn = document.getElementById("nextChapter");

const bookmarkBtn = document.getElementById("bookmarkBtn");

const increaseBtn = document.getElementById("increaseFont");
const decreaseBtn = document.getElementById("decreaseFont");
const darkModeBtn = document.getElementById("darkMode");
const translateBtn = document.getElementById("translateBtn");
const stars = document.querySelectorAll(".star");
const averageRating = document.getElementById("averageRating");

const commentInput = document.getElementById("commentInput");
const postComment = document.getElementById("postComment");
const commentsContainer = document.getElementById("commentsContainer");

// ===============================
// Variables
// ===============================

let chapterList = [];
let currentChapter = 0;
let fontSize = 18;

// ===============================
// Load Novel
// ===============================

async function loadNovel(){

    if(!novelId){

        alert("Novel not found.");
        return;

    }

    try{

        const snap = await getDoc(
            doc(db,"novels",novelId)
        );

        if(!snap.exists()){

            alert("Novel not found.");
            return;

        }

        const novel = snap.data();

        novelCover.src = novel.cover;
        novelTitle.textContent = novel.title;
        novelGenre.textContent = novel.genre;
        novelDescription.textContent = novel.description;
        totalChapters.textContent = novel.chapters;
        novelStatus.textContent = "🟢 " + novel.status;
        novelRating.textContent = novel.rating || "0.0";
        novelReads.textContent = novel.reads || 0;


        await updateDoc(

    doc(db,"novels",novelId),

    {

        reads:(novel.reads || 0) + 1

    }

);
    }

    catch(error){

        console.log(error);

    }

}

// ===============================
// Load Chapters
// ===============================

async function loadChapters(){

    chapterContainer.innerHTML = "";

    chapterList = [];

    const snapshot = await getDocs(

        collection(
            db,
            "novels",
            novelId,
            "chapters"
        )

    );

    snapshot.forEach((item)=>{

        chapterList.push({

            id:item.id,
            ...item.data()

        });

    });

    chapterList.sort(

        (a,b)=>

        Number(a.chapterNumber) -
        Number(b.chapterNumber)

    );

    chapterList.forEach((chapter,index)=>{

        const link = document.createElement("a");

        link.href="#";

        link.textContent =
        `Chapter ${chapter.chapterNumber} — ${chapter.chapterTitle}`;

        if(index===0){

            link.classList.add("active");

        }

        link.onclick=(e)=>{

            e.preventDefault();

            showChapter(index);

        };

        chapterContainer.appendChild(link);

    });

    if(chapterList.length>0){

        showChapter(0);

    }

    else{

        chapterTitle.textContent="No Chapters";

        storyText.innerHTML=
        "<p>No chapter uploaded yet.</p>";

    }

}
// ===============================
// Show Chapter
// ===============================

function showChapter(index){

    currentChapter = index;

    const chapter = chapterList[index];

    if(!chapter) return;

    chapterTitle.textContent =
    `Chapter ${chapter.chapterNumber} — ${chapter.chapterTitle}`;

    storyText.innerHTML =
    `<p>${chapter.story.replace(/\n/g,"<br>")}</p>`;

    setActiveChapter();

    updateButtons();

    saveProgress();

}

// ===============================
// Active Chapter
// ===============================

function setActiveChapter(){

    document
    .querySelectorAll("#chapterContainer a")
    .forEach((a,i)=>{

        a.classList.toggle(
            "active",
            i===currentChapter
        );

    });

}

// ===============================
// Previous / Next Buttons
// ===============================

function updateButtons(){

    prevBtn.disabled =
    currentChapter===0;

    nextBtn.disabled =
    currentChapter===chapterList.length-1;

}

prevBtn.onclick=()=>{

    if(currentChapter>0){

        showChapter(currentChapter-1);

    }

};

nextBtn.onclick=()=>{

    if(currentChapter<chapterList.length-1){

        showChapter(currentChapter+1);

    }

};

// ===============================
// Save Reading Progress
// ===============================

function saveProgress(){

    if(!chapterList[currentChapter]) return;

    const progress={

        novelId:novelId,
        title:novelTitle.textContent,
        cover:novelCover.src,

        chapterIndex:currentChapter,
        
        chapterId: chapterList[currentChapter].id,

        chapterNumber:
        chapterList[currentChapter].chapterNumber,

        chapterTitle:
        chapterList[currentChapter].chapterTitle

    };

    localStorage.setItem(

        "continueReading",

        JSON.stringify(progress)

    );

    checkLogin(async(user)=>{

        if(!user) return;

        await setDoc(

            doc(
                db,
                "users",
                user.uid,
                "library",
                novelId
            ),

            progress

        );

    });

}

// ===============================
// Bookmark
// ===============================

if(bookmarkBtn){

bookmarkBtn.onclick=()=>{

    checkLogin(async(user)=>{

        if(!user){

            alert("Please login first.");
            return;

        }

        await setDoc(

            doc(
                db,
                "users",
                user.uid,
                "bookmarks",
                novelId
            ),

            {

                novelId:novelId,

                title:novelTitle.textContent,

                cover:novelCover.src,

                chapter:currentChapter

            }

        );

        alert("Bookmarked ❤️");

    });

};

}
// ===============================
// Font Size Controls
// ===============================

if(increaseBtn){

increaseBtn.onclick = ()=>{

    fontSize += 2;

    storyText.style.fontSize =
    fontSize + "px";

};

}


if(decreaseBtn){

decreaseBtn.onclick = ()=>{

    if(fontSize > 12){

        fontSize -= 2;

        storyText.style.fontSize =
        fontSize + "px";

    }

};

}


if(darkModeBtn){

darkModeBtn.onclick = ()=>{

    document.body.classList.toggle("dark-mode");

    if(document.body.classList.contains("dark-mode")){

        darkModeBtn.innerHTML = "☀️";

    }else{

        darkModeBtn.innerHTML = "🌙";

    }

    localStorage.setItem(
        "darkMode",
        document.body.classList.contains("dark-mode")
    );

};

}

// Load Saved Dark Mode

if(localStorage.getItem("darkMode") === "true"){

    document.body.classList.add("dark-mode");

    darkModeBtn.innerHTML = "☀️";

}else{

    darkModeBtn.innerHTML = "🌙";

}


// ===============================
// Comments
// ===============================


async function loadComments(){

    if(!commentsContainer) return;


    commentsContainer.innerHTML="";


    const snapshot = await getDocs(

        collection(
            db,
            "novels",
            novelId,
            "comments"
        )

    );


    snapshot.forEach((item)=>{
    const commentId = item.id;


        const comment =
        item.data();
               let time = "Just now";

if (comment.createdAt) {

    const date = comment.createdAt.toDate();

    const diff = Math.floor((Date.now() - date.getTime()) / 1000);

    if (diff < 60) {

        time = "Just now";

    } else if (diff < 3600) {

        time = Math.floor(diff / 60) + " min ago";

    } else if (diff < 86400) {

        time = Math.floor(diff / 3600) + " hr ago";

    } else {

        time = Math.floor(diff / 86400) + " days ago";

    }

}

        const div =
        document.createElement("div");


       div.className = "comment-card";


div.innerHTML = `

<div class="comment-user">

    <img
        class="comment-avatar"
        src="${comment.avatar || "images/default-user.png"}"
    >

    <div class="comment-info">

        <div class="comment-top">

            <h4>${comment.name || "Reader"}</h4>

            ${
                auth.currentUser &&
                auth.currentUser.uid === comment.userId
                ?
                `<i class="fa-solid fa-trash delete-comment"
                    data-id="${commentId}">
                </i>`
                :
                ""
            }

        </div>

        <span class="comment-time">${time}</span>

        <p>${comment.text}</p>

    </div>

</div>

`;
const deleteBtn =
div.querySelector(".delete-comment");

if(deleteBtn){

    deleteBtn.onclick = async()=>{

        if(!confirm("Delete this comment?"))
        return;

        await deleteDoc(

            doc(
                db,
                "novels",
                novelId,
                "comments",
                deleteBtn.dataset.id
            )

        );

        loadComments();

    };

}


        commentsContainer.appendChild(div);


    });


}

// ===============================
// Rating System
// ===============================

async function loadRating(){

    const snapshot = await getDocs(

        collection(
            db,
            "novels",
            novelId,
            "ratings"
        )

    );

    let total = 0;
    let count = 0;

    snapshot.forEach((item)=>{

        total += item.data().rating;
        count++;

    });

    if(count > 0){

        averageRating.textContent =
        (total / count).toFixed(1);

    }else{

        averageRating.textContent = "0.0";

    }

}

stars.forEach((star)=>{

    star.onclick = ()=>{

        checkLogin(async(user)=>{

            if(!user){

                alert("Please login first.");
                return;

            }

            const value =
            Number(star.dataset.value);

            stars.forEach((s,index)=>{

                if(index < value){

                    s.classList.remove("fa-regular");
                    s.classList.add("fa-solid","active");

                }else{

                    s.classList.remove("fa-solid","active");
                    s.classList.add("fa-regular");

                }

            });

            await setDoc(

                doc(
                    db,
                    "novels",
                    novelId,
                    "ratings",
                    user.uid
                ),

                {
                    rating:value
                }

            );
               const ratingSnap = await getDocs(

    collection(db,"novels",novelId,"ratings")

);

let total = 0;

let count = 0;

ratingSnap.forEach((item)=>{

    total += item.data().rating;

    count++;

});

await updateDoc(

    doc(db,"novels",novelId),

    {

        rating:(total/count).toFixed(1),

        ratingCount:count

    }

);
            loadRating();

        });

    };

});
// Add Comment

if(postComment){


postComment.onclick = ()=>{


checkLogin(async(user)=>{


    if(!user){

        alert(
        "Please login to comment."
        );

        return;

    }


    const text =
    commentInput.value.trim();


    if(!text){

        alert(
        "Write a comment first."
        );

        return;

    }


const profileSnap = await getDoc(
    doc(db, "users", user.uid)
);

let userName = "Reader";
let userAvatar = "images/default-user.png";

if (profileSnap.exists()) {

    const profile = profileSnap.data();

    userName = profile.name || "Reader";
    userAvatar = profile.avatar || "images/default-user.png";
}

await addDoc(

    collection(
        db,
        "novels",
        novelId,
        "comments"
    ),

    {

        text: text,

        name: userName,

        avatar: userAvatar,

        userId: user.uid,

        createdAt: serverTimestamp()

    }

);


    commentInput.value="";


    loadComments();


});


};


}


// ===============================
// Start Website
// ===============================


async function start(){

    await loadNovel();

    await loadChapters();

    await loadComments();


}


start();
await loadRating();
// ===============================
// Translate Chapter
// ===============================

if(translateBtn){

translateBtn.onclick = async ()=>{

    const language = prompt(

`Translate to:

ur = Urdu
hi = Hindi
ar = Arabic
tr = Turkish
es = Spanish
fr = French
ja = Japanese
ko = Korean
zh-CN = Chinese

Example: ur`

    );

    if(!language) return;

    const originalText = storyText.innerText;

    try{

        const response = await fetch(

`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${language}&dt=t&q=${encodeURIComponent(originalText)}`

        );

        const data = await response.json();

        let translated = "";

        data[0].forEach(item=>{

            translated += item[0];

        });

        storyText.innerHTML = `<p>${translated}</p>`;

    }

    catch(error){

        alert("Translation failed.");

        console.log(error);

    }

};

}