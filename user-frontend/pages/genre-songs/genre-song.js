import { Query, databases, storage } from "../../appwrite/config";
import { BUCKET_ID, DATABASE_ID, SONG_COLLECTION_ID } from "../../utils/sceret";

(() => {
    // console.log(window.location.href);//this will give entire URL
    // console.log(window.location.href.split("?")[1]); // this will give the QUERY
    // console.log(window.location.href.split("?")[1].split("=")[1]); // this will give the GENRE_NAME
    const activeGenre = document.querySelector("#curr-genre")
    const genreSongCont = document.querySelector("#genre-song-cont")
    const GENRE_NAME = window.location.href.split("?")[1].split("=")[1]
    activeGenre.innerHTML = GENRE_NAME;
    const fetchSongByGenreName = async () => {
        try {
            const songArr = await databases.listDocuments(DATABASE_ID, SONG_COLLECTION_ID,
                [
                    Query.limit(10),
                    Query.equal("genre", [GENRE_NAME])
                ])

            console.log(songArr);

            songArr.documents.forEach((element) => {

                const songBox = document.createElement("div");
                // const src = 
                songBox.classList.add("genre-song-box")
                const result = storage.getFileDownload(BUCKET_ID, element.thumbnailid);
                songBox.style.backgroundImage = `url(${result.href})`
                const html = `<div class="song-title">${element.title}</div>
                <div class="song-artist">${element.artist}</div>`
                songBox.innerHTML = html
                genreSongCont.appendChild(songBox)
            })

        } catch (error) {
            console.log(error);
        }
    }

    fetchSongByGenreName();
})();