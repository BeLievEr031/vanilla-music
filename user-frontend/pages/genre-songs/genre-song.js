import { Query, databases, storage } from "../../appwrite/config";
import { BUCKET_ID, DATABASE_ID, SONG_COLLECTION_ID } from "../../utils/sceret";

(() => {
    // console.log(window.location.href);//this will give entire URL
    // console.log(window.location.href.split("?")[1]); // this will give the QUERY
    // console.log(window.location.href.split("?")[1].split("=")[1]); // this will give the GENRE_NAME
    const activeGenre = document.querySelector("#curr-genre")
    const genreSongCont = document.querySelector("#genre-song-cont")
    const audioElement = document.querySelector("audio")
    let playAndPause = document.querySelector("#play")
    const progressBar = document.querySelector(".progressBar")
    const GENRE_NAME = window.location.href.split("?")[1].split("=")[1]
    activeGenre.innerHTML = GENRE_NAME;
    let isPlay = false;
    let songArr = null
    let index = 0;
    const fetchSongByGenreName = async () => {
        try {
            songArr = await databases.listDocuments(DATABASE_ID, SONG_COLLECTION_ID,
                [
                    Query.limit(10),
                    Query.equal("genre", [GENRE_NAME])
                ])

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

                songBox.addEventListener("click", () => {
                    const src = storage.getFileDownload(BUCKET_ID, element.songid);
                    audioElement.src = src
                    audioElement.play();
                    handlePlayPause();
                    handleProgressBar(audioElement);
                })
            })

        } catch (error) {
            console.log(error);
        }
    }

    fetchSongByGenreName();

    const myBar = document.querySelector(".myBar")
    var calculationCount = 1;
    var intervalInSeconds = 3;
    let tduration = null;

    function handleProgressBar(audioElement) {
        let cTime = document.querySelector("#c-time")
        let totalDuration = document.querySelector("#t-duration")
        audioElement.addEventListener('timeupdate', function (e) {
            e.stopPropagation();
            e.preventDefault();

            if (tduration === null) {
                tduration = audioElement.duration;
                totalDuration.innerText = formatAudioDuration(tduration);
            }

            cTime.innerText = formatAudioDuration(audioElement.currentTime);

            const currentSeconds = audioElement.currentTime;
            if (currentSeconds > (calculationCount * intervalInSeconds)) {
                let percent = (Math.floor(currentSeconds) / Math.ceil(tduration))
                console.log((Math.floor(currentSeconds) / Math.ceil(tduration) * 100) + "%");
                myBar.style.width = (percent * 100) + "%";
                calculationCount++;
            }
        });
    }


    function formatAudioDuration(durationInSeconds) {
        const minutes = Math.floor(durationInSeconds / 60);
        const seconds = Math.floor(durationInSeconds % 60);
        const formattedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
        return `${minutes}:${formattedSeconds}`;
    }

    progressBar.addEventListener("click", (event) => {
        seek(event)
    })

    let isLeftDown = false;

    progressBar.addEventListener("mousedown", (e) => {
        if (e.buttons === 1) {
            isLeftDown = true;
            audioElement.pause()
        }
    })

    progressBar.addEventListener("mousemove", (event) => {
        if (isLeftDown) {
            seek(event)
        }
    })

    progressBar.addEventListener("mouseup", (event) => {
        isLeftDown = false;
        seek(event, true)
    })

    function seek(event, isMouseUp = false) {
        var percent = (event.offsetX / progressBar.offsetWidth);
        myBar.style.width = `${percent * 100}%`
        if (audioElement && isMouseUp) {
            audioElement.currentTime = percent * audioElement.duration
            audioElement.play()
        }
    }


    function handlePlayPause() {
        if (isPlay) {
            playAndPause.innerText = "play_arrow"
            audioElement.pause()
        } else {
            if (songArr && audioElement.src === window.location.href) {
                audioElement.src = storage.getFileDownload(BUCKET_ID, songArr.documents[0].songid)
                handleProgressBar(audioElement);
            }
            playAndPause.innerText = "pause"
            audioElement.play()
        }

        isPlay = !isPlay;
    }

    playAndPause.addEventListener("click", handlePlayPause)
    audioElement.addEventListener("ended", () => {
        handlePlayPause();
        console.log(songArr);
        index = index + 1;
        audioElement.src = storage.getFileDownload(BUCKET_ID, songArr.documents[index].songid)
        handleReset()
        handlePlayPause();

    })

    function handleReset() {
        myBar.style.width = '0%'
        calculationCount = 1;
    }
})();