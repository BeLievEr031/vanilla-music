import { client, Query, databases } from "../appwrite/config";
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
    let genresArr = [];
    let artistsArr = [];
    const handleGenrePopulate = async () => {
        try {
            genresArr = await databases.listDocuments(DATABASE_ID, GENRE_COLLECTION_ID,
                [
                    Query.limit(15),
                ]
            );
            genresArr.documents.forEach((elem, index) => {
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
            artistsArr = await databases.listDocuments(DATABASE_ID, ARTIST_COLLECTION_ID,
                [
                    Query.limit(15),
                ]
            );

            artistsArr.documents.forEach((elem, index) => {
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

    const genreNameInp = document.querySelector("#genre-name-inp")
    const artistNameInp = document.querySelector("#artist-name-inp")


    function debounce(func, delay) {
        let timerId;

        return function (...args) {
            if (timerId) {
                clearTimeout(timerId);
            }

            timerId = setTimeout(() => {
                func.apply(this, args);
                timerId = null;
            }, delay);
        };
    }

    const fetchedGenreData = debounce(async () => {
        if (genreNameInp.value.trim().length === 0) {
            genreBox.innerHTML = ""
            genresArr.documents.forEach((elem, index) => {
                const span = document.createElement("span")
                span.classList.add("genre-name")
                span.innerText = elem.name
                genreBox.appendChild(span)
            })

            return;
        }

        try {

            const searchedGenreArr = await databases.listDocuments(DATABASE_ID, GENRE_COLLECTION_ID,
                [
                    Query.limit(15),
                    Query.search("name", genreNameInp.value)
                ]
            );

            if (searchedGenreArr.documents.length > 0) {
                genreBox.innerHTML = ""
            } else if (searchedGenreArr.documents.length === 0) {
                genreBox.innerHTML = "No Genre found"
                return;
            }

            searchedGenreArr.documents.forEach((elem, index) => {
                const span = document.createElement("span")
                span.classList.add("genre-name")
                span.innerText = elem.name
                genreBox.appendChild(span)
            })
        } catch (error) {
            console.log(error);
        }
    }, 1500)

    const fetchedArtistData = debounce(async () => {
        if (artistNameInp.value.trim().length === 0) {
            artistBox.innerHTML = ""
            artistsArr.documents.forEach((elem, index) => {
                const span = document.createElement("span")
                span.classList.add("genre-name")
                span.innerText = elem.name
                artistBox.appendChild(span)
            })
            return;
        }

        try {
            const searchedGenreArr = await databases.listDocuments(DATABASE_ID, ARTIST_COLLECTION_ID,
                [
                    Query.limit(15),
                    Query.search("name", artistNameInp.value)
                ]
            );

            if (searchedGenreArr.documents.length > 0) {
                artistBox.innerHTML = ""
            } else if (searchedGenreArr.documents.length === 0) {
                artistBox.innerHTML = "No Genre found"
                return;
            }

            searchedGenreArr.documents.forEach((elem, index) => {
                const span = document.createElement("span")
                span.classList.add("artist-name")
                span.innerText = elem.name
                artistBox.appendChild(span)
            })
        } catch (error) {
            console.log(error);
        }
    }, 1500)

    genreNameInp.addEventListener("input", fetchedGenreData)
    artistNameInp.addEventListener("input", fetchedArtistData)
});



