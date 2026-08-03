import {
    auth,
    onAuthStateChanged,
    db,
    collection,
    addDoc,
    getDocs,
    doc,
    deleteDoc
} from "./firebase.js";

const ADMIN_EMAIL = "littlezayys93@gmail.com";

onAuthStateChanged(auth, (user) => {

    if (!user) {

        alert("Please login first.");

        window.location.href = "login.html";

        return;

    }

    if (user.email !== ADMIN_EMAIL) {

        alert("Access Denied!");

        window.location.href = "index.html";

        return;
       
    }
startAdmin();
});

const totalNovels = document.getElementById("totalNovels");
const totalChapters = document.getElementById("totalChapters");
const totalReaders = document.getElementById("totalReaders");
const featuredBooks = document.getElementById("featuredBooks");
const novelForm = document.getElementById("novelForm");
// ===============================
// Dashboard Stats
// ===============================

async function loadDashboardStats(){

    // Total Novels
    const novelsSnapshot = await getDocs(
        collection(db, "novels")
    );

    totalNovels.textContent = novelsSnapshot.size;

    // Total Chapters
    let chaptersCount = 0;

    for(const novel of novelsSnapshot.docs){

        const chaptersSnapshot = await getDocs(

            collection(
                db,
                "novels",
                novel.id,
                "chapters"
            )

        );

        chaptersCount += chaptersSnapshot.size;

    }
    

    totalChapters.textContent = chaptersCount;
    // Total Readers
let readersCount = 0;

novelsSnapshot.forEach((doc) => {

    const novel = doc.data();

    readersCount += Number(novel.reads || 0);

});

totalReaders.textContent = readersCount;


// Featured Books
featuredBooks.textContent = novelsSnapshot.size;

}

novelForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    const title = document.getElementById("novelTitle").value;
    const genre = document.getElementById("novelGenre").value;
    const description = document.getElementById("novelDescription").value;
    const cover = document.getElementById("novelCover").value;
    const chapters = document.getElementById("novelChapters").value;
    const status = document.getElementById("novelStatus").value;

    try {

await addDoc(collection(db, "novels"), {

    title,
    genre,
    description,
    cover,
    chapters,
    status,

    rating:0,
    ratingCount:0,
    reads:0

});

        alert("Novel Saved Successfully ✅");

await loadNovels();
await showNovels();
await loadDashboardStats();

novelForm.reset();

    } catch (error) {

        console.error(error);

        alert("Error Saving Novel ❌");

    }

});
const novelSelect = document.getElementById("novelSelect");

async function loadNovels() {

    const snapshot = await getDocs(collection(db, "novels"));

    novelSelect.innerHTML =
        '<option value="">Select Novel</option>';

    snapshot.forEach((doc) => {

        const novel = doc.data();

        novelSelect.innerHTML += `
            <option value="${doc.id}">
                ${novel.title}
            </option>
        `;

    });

}


const chapterForm = document.getElementById("chapterForm");

chapterForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    const novelId = document.getElementById("novelSelect").value;
    const chapterNumber = document.getElementById("chapterNumber").value;
    const chapterTitle = document.getElementById("chapterTitle").value;
    const story = document.getElementById("story").value;

    try {

        await addDoc(

    collection(
        doc(db, "novels", novelId),
        "chapters"
    ),

    {

        chapterNumber,
        chapterTitle,
        story

    }

);

   alert("Chapter Saved Successfully ✅");

await loadDashboardStats();

chapterForm.reset();
    } catch (error) {

        console.error(error);

        alert("Error Saving Chapter ❌");

    }

});
const novelsList = document.getElementById("novelsList");

async function showNovels() {

    const snapshot = await getDocs(collection(db, "novels"));

    novelsList.innerHTML = "";

    snapshot.forEach((item) => {

        const novel = item.data();

        novelsList.innerHTML += `

        <div class="novel-item">

            <div>

                <h3>${novel.title}</h3>

                <p>${novel.genre}</p>

            </div>

            <div>

                <button onclick="deleteNovel('${item.id}')">

                    Delete

                </button>

            </div>

        </div>

        `;

    });

}

 async function startAdmin() {

    await loadNovels();

    await showNovels();

    await loadDashboardStats();

}
window.deleteNovel = async function (id) {

    const confirmDelete = confirm(
        "Are you sure you want to delete this novel?"
    );

    if (!confirmDelete) return;

    try {

        await deleteDoc(
            doc(db, "novels", id)
        );

        alert("Novel Deleted Successfully ✅");

        showNovels();

        loadNovels();
       loadDashboardStats();
    } catch (error) {

        console.error(error);

        alert("Error Deleting Novel ❌");

    }

};