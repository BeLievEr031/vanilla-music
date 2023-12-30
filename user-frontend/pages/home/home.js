(() => {
    const url = window.location.href;
    const splittedArr = url.split("/")
    console.log(splittedArr[splittedArr.length - 1]);
    if (splittedArr[splittedArr.length - 1] === "home.html") {
        console.log("hjh");
        document.querySelector("#home").classList.add("active-siebar-link")
    } else {
        document.querySelector("#home").classList.remove("active-siebar-link")
    }
})();


import { BUCKET_ID, DATABASE_ID, SONG_COLLECTION_ID } from "../../utils/sceret.js"
import { databases, Query, storage } from "../../appwrite/config.js"

const popularSongBox = document.querySelector(".popular-song-box")
const populateSong = async () => {
    try {
        const response = await databases.listDocuments(DATABASE_ID, SONG_COLLECTION_ID,
            [
                Query.limit(3)
            ])

        console.log(response);
        response.documents.forEach((element, index) => {
            const popularSongRow = document.createElement("div")
            popularSongRow.classList.add("popular-song-row")
            const html = `
              <div class="album-img-box">
                <img src="../../public/hero-img.jpg" alt="song-thumbnail" />
              </div>
              <div class="song-detail-box">
                <div class="song-name">${element.title}</div>
                <div class="artist-name">${element.artist}</div>
              </div>

              <div
                class="play-btn"
                style="font-variation-settings: 'FILL' 1, 'wght' 700, 'GRAD' 0,'opsz' 48;"
              >
                <span class="material-symbols-outlined" id="play-btn"> play_arrow </span>
            `

            popularSongRow.innerHTML = html;
            popularSongRow.querySelector("#play-btn")._songid = element.songid;
            // popularSongRow._songid = element.songid
            popularSongRow._id = element.$id

            popularSongBox.appendChild(popularSongRow)

            popularSongRow.addEventListener("click", async (e) => {
                // console.log(e.target.id === "play-btn");
                const audio = document.querySelector("audio")

                if (e.target.id === "play-btn") {
                    console.log(e.target._songid);
                    const result = storage.getFileDownload(BUCKET_ID, e.target._songid);
                    audio.src = result.href
                    audio.play();
                    console.log(result); //
                    
                    e.target.innerText = "pause"
                }
            })

        })


    } catch (error) {
        console.log(error);
    }
}

populateSong();