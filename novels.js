import {
    db,
    collection,
    getDocs
} from "./firebase.js";
console.log("novels.js loaded ✅");
const novelsContainer = document.getElementById("novelsContainer");
const searchInput = document.getElementById("searchInput");
const genreButtons = document.querySelectorAll(".genre-btn");

let allNovels = [];
let currentGenre = "All";
async function loadNovels() {

    try {

        novelsContainer.innerHTML = "";

        const snapshot = await getDocs(collection(db, "novels"));
        allNovels = [];

snapshot.forEach((doc) => {

    allNovels.push({

        id: doc.id,
        ...doc.data()

    });

});
        console.log("Documents Found:", snapshot.size);

snapshot.forEach((doc) => {
    console.log(doc.id, doc.data());
});

        if (snapshot.empty) {

            novelsContainer.innerHTML = `
                <div class="no-novels">
                    <h2>No Novels Found 📚</h2>
                    <p>No novels have been added yet.</p>
                </div>
            `;

            return;
        }

        displayNovels(allNovels);

    }

    catch (error) {

        console.error("Error Loading Novels:", error);

        novelsContainer.innerHTML = `
            <div class="no-novels">
                <h2>Something went wrong 😢</h2>
                <p>Please check the console.</p>
            </div>
        `;

    }

}
function displayNovels(novels){

    novelsContainer.innerHTML = "";

    if(novels.length === 0){

        novelsContainer.innerHTML = `
            <div class="no-novels">

                <h2>No Novels Found 📚</h2>

            </div>
        `;

        return;

    }

    novels.forEach((novel)=>{

        novelsContainer.innerHTML += `

        <div class="novel-card">

            <img src="${novel.cover}">

            <div class="novel-info">

                <span class="genre">
                    ${novel.genre}
                </span>

                <h3>${novel.title}</h3>

                <div class="novel-meta">

                    <span>
                        📚 ${novel.chapters} Chapters
                    </span>

                    <span>
                        🟢 ${novel.status}
                    </span>

                </div>

                <p class="description">
                    ${novel.description}
                </p>

                <a href="read.html?id=${novel.id}"
                   class="read-btn">

                   Read Now

                </a>

            </div>

        </div>

        `;

    });

}
loadNovels();
// ===============================
// Search
// ===============================

if(searchInput){

    searchInput.addEventListener("input", ()=>{

        const keyword = searchInput.value
            .toLowerCase()
            .trim();

        const filtered = allNovels.filter((novel)=>{

            const matchTitle =
                novel.title.toLowerCase().includes(keyword);

            const matchGenre =
                novel.genre.toLowerCase().includes(keyword);

            const matchDescription =
                novel.description.toLowerCase().includes(keyword);

            return (
                matchTitle ||
                matchGenre ||
                matchDescription
            );

        });

        displayNovels(filtered);

    });

}
// ===============================
// Genre Filter
// ===============================

genreButtons.forEach((button)=>{

    button.onclick = ()=>{

        const genre = button.dataset.genre;

        if(genre === "All"){

            displayNovels(allNovels);

            return;

        }

        const filtered = allNovels.filter((novel)=>{

            return novel.genre === genre;

        });

        displayNovels(filtered);

    };

});