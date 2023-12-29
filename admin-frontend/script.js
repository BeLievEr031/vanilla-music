document.addEventListener("DOMContentLoaded", async () => {
    const audio = document.querySelector("#audio")
    const play = document.querySelector("#play")
    const pause = document.querySelector("#pause")
    const prev = document.querySelector("#prev")
    const next = document.querySelector("#next")
    const back = document.querySelector("#back")
    const forward = document.querySelector("#forward")
    const btn2x = document.querySelector("#double-speed")

    const songArr = [
        {
            src: "./public/test-music.webm"
        },
        {
            src: "./public/phiraurkya.webm"
        },
        {
            src: "./public/RamSiyaRam.webm"
        },
        {
            src: "./public/sanamre.webm"
        },
    ]

    play.addEventListener("click", () => {
        audio.play();
    })
    pause.addEventListener("click", () => {
        audio.pause();
    })

    prev.addEventListener("click", () => {
        audio.src = "./public/sanamre.webm"
    })

    next.addEventListener("click", () => {
        audio.src = "./public/phiraurkya.webm"
    })

    let tduration = 0;
    let calculationCount = 1;
    const intervalInSeconds = 3;


    async function load() {
        audio.addEventListener('loadedmetadata', function () {
            tduration = audio.duration;
            calculationCount = 1;
            console.log(tduration);
        });
    }

    await load();

    // Update current time during playback
    let myBar = document.querySelector('.myBar')

    audio.addEventListener('timeupdate', function (e) {
        e.stopPropagation();
        e.preventDefault();
        // console.log(45);
        const currentSeconds = audio.currentTime;
        console.log(tduration);
        if (currentSeconds > (calculationCount * intervalInSeconds)) {
            // Perform your calculation here
            console.log(45);
            let percent = (Math.floor(currentSeconds) / Math.ceil(tduration))
            console.log((Math.floor(currentSeconds) / Math.ceil(tduration) * 100) + "%");
            myBar.style.width = (percent * 100) + "%";
            calculationCount++;
        }

        // let percent = (currentSeconds / tduration)
        // console.log(currentSeconds);

        // console.log(tduration);
        // console.log(percent);
        // myBar.style.width = (percent * 100) + "%";
    });


    back.addEventListener('click', function () {
        audio.currentTime -= 10;
    });

    forward.addEventListener('click', function () {
        audio.currentTime += 10;
    });

    btn2x.addEventListener("click", () => {
        audio.playbackRate = .75;
    })

    const progressbar = document.querySelector('.progressBar')
    progressbar.addEventListener("click", seek.bind(this));
    let isRightMouseDown = false;
    // progressbar.addEventListener("")

    progressbar.addEventListener('mousedown', function (event) {
        isRightMouseDown = true;
    });

    progressbar.addEventListener('mousemove', function (event) {
        if (isRightMouseDown) {
            seek(event)
        }
    });

    function seek(event) {
        var percent = event.offsetX / progressbar.offsetWidth;
        audio.currentTime = percent * audio.duration; //Slider duration
        myBar.style.width = percent * 100 + "%";
    }
})