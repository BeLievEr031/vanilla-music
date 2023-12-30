import { Query, databases } from "../appwrite/config";
import { ARTIST_COLLECTION_ID, DATABASE_ID, GENRE_COLLECTION_ID } from "../utils/secret";
import toast from "../utils/toast";
document.addEventListener('DOMContentLoaded', async () => {
    const dropArea = document.getElementById('drop-area');
    const fileInput = document.getElementById('fileInput');
    const previewContainer = document.getElementById('preview-container');
    const musicPlayer = document.querySelector(".music-player")
    let playAndPause = document.querySelector("#play")
    let audioVisualizer = document.querySelector(".audio-visulizer")
    const progressBar = document.querySelector(".progressBar")
    let audioElement = null;
    let isPlay = false;

    dropArea.addEventListener("dragenter", (e) => {
        preventDefaults(e)
        isHighlight(true)
    })

    dropArea.addEventListener("dragover", (e) => {
        preventDefaults(e)
        isHighlight(true)
    })

    dropArea.addEventListener("dragleave", (e) => {
        preventDefaults(e)
        isHighlight(false)
    })

    dropArea.addEventListener("drop", (e) => {
        preventDefaults(e)
        isHighlight(false)
        handleDrop(e)
    })

    dropArea.addEventListener("click", () => {
        fileInput.click();
    })

    // Handle file input change
    fileInput.addEventListener('change', (e) => {
        console.log(e.target.files[0]);
        handleFiles(e.target.files)
    }, false);

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    function isHighlight(isHighlight) {
        if (isHighlight) {
            dropArea.classList.add('highlight');
            return;
        }
        dropArea.classList.remove('highlight');
        return;
    }

    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        console.log(files);
        handleFiles(files);
    }

    function handleFiles(files) {
        files = [...files];
        files.forEach(previewFile);
    }

    function previewFile(file) {
        const reader = new FileReader();//BOM FileReader

        reader.readAsDataURL(file);
        reader.onloadend = function () {

            const tempAudio = previewContainer.querySelector("audio");
            if (tempAudio) {
                tempAudio.remove()
            }
            const audio = document.createElement('audio');
            audio.setAttribute("controls", "")
            const source = document.createElement('source');
            source.setAttribute("type", "audio/mpeg")

            source.src = reader.result;

            audio.appendChild(source)
            previewContainer.appendChild(audio);
            audioElement = audio;

            dropArea.style.display = "none"
            musicPlayer.style.display = "block"
            handleProgressBar(audioElement)
            toast(true, "song loaded successfully !!")

        };
    }

    playAndPause.addEventListener("click", function () {
        if (!audioElement) return toast(false, "Error while loading song")
        if (!isPlay) {
            audioElement.play();
            this.innerText = "pause"
            audioVisualizer.style.backgroundImage = "url(../public/audio-visualizer.gif)"
        } else {
            audioElement.pause();
            this.innerText = "play_arrow"
            audioVisualizer.style.backgroundImage = "url(../public/pause-audio-visualizer.png)"
        }

        isPlay = !isPlay;
    })


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

        // Add leading zero if seconds is a single digit
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


    const genreBox = document.querySelector(".genre-in-db")
    const artistBox = document.querySelector(".artist-in-db")

    const handleGenrePopulate = async () => {
        try {
            const genresArr = await databases.listDocuments(DATABASE_ID, GENRE_COLLECTION_ID,
                [
                    Query.limit(15),
                ]
            );
            genresArr.documents.forEach((elem, index) => {
                console.log(elem);
                const span = document.createElement("span")
                span.classList.add("genre-name")
                span.innerText = elem.name
                genreBox.appendChild(span)
            })
        } catch (error) {
            console.log(error);
        }
    }

    const handleArtistPopulate = async () => {
        try {
            const artistArr = await databases.listDocuments(DATABASE_ID, ARTIST_COLLECTION_ID,
                [
                    Query.limit(15),
                ]
            );
            artistArr.documents.forEach((elem, index) => {
                const span = document.createElement("span")
                span.classList.add("artist-name")
                span.innerText = elem.name
                artistBox.appendChild(span)
            })
        } catch (error) {
            console.log(error);
        }
    }

    await handleGenrePopulate()
    await handleArtistPopulate()

});



