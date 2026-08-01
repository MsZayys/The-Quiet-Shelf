import {
    db,
    auth,
    checkLogin,
    collection,
    getDocs
} from "./firebase.js";

const container = document.getElementById("libraryContainer");

checkLogin(async(user)=>{

    if(!user){

        container.innerHTML=`
        <h2>Please Login First 📚</h2>
        `;
        return;

    }

    const snapshot=await getDocs(

        collection(db,"users",user.uid,"library")

    );

    if(snapshot.empty){

        container.innerHTML=`
        <h2>No Reading Progress Yet 📖</h2>
        <p>Start reading a novel first.</p>
        `;
        return;

    }

    snapshot.forEach((doc)=>{

        const novel=doc.data();

        container.innerHTML+=`

        <div class="novel-card">

            <img src="${novel.cover}">

            <div class="novel-info">

                <h3>${novel.title}</h3>

                <p>

                Continue from
                Chapter ${novel.chapterNumber}

                </p>

                <a
                href="read.html?id=${novel.novelId}"
                class="read-btn">

                Continue Reading

                </a>

            </div>

        </div>

        `;

    });

});