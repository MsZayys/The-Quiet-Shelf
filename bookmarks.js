import{
    db,
    checkLogin,
    collection,
    getDocs
}from "./firebase.js";

const container=document.getElementById("bookmarkContainer");

checkLogin(async(user)=>{

    if(!user){

        container.innerHTML=`
        <h2>Please Login First ❤️</h2>
        `;
        return;

    }

    const snapshot=await getDocs(

        collection(db,"users",user.uid,"bookmarks")

    );

    if(snapshot.empty){

        container.innerHTML=`
        <h2>No Bookmarks Yet</h2>
        <p>You haven't bookmarked any stories.</p>
        `;
        return;

    }

    snapshot.forEach((item)=>{

        const novel=item.data();

        container.innerHTML+=`

        <div class="novel-card">

            <img src="${novel.cover}">

            <div class="novel-info">

                <h3>${novel.title}</h3>

                <a
                href="read.html?id=${novel.novelId}"
                class="read-btn">

                Read Now

                </a>

            </div>

        </div>

        `;

    });

});