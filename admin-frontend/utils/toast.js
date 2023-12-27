const hotToast = document.querySelector(".hot-toast")
const stripColor = document.querySelector(".strip-color")
const message = document.querySelector(".message")
const body = document.querySelector("body")
let setTimerID = null;
const toast = (success, msg) => {
    if (success) {
        stripColor.style.backgroundColor = "green"
    } else {
        stripColor.style.backgroundColor = "red"
    }
    message.innerText = msg
    hotToast.style.opacity = 1
    hotToast.style.transform = `translateX(0)`

    setTimerID = setTimeout(() => {
        hotToast.style.opacity = 0;
        hotToast.style.transform = `translateX(50%)`
    }, 1500)
}

// Assignment

// hotToast.addEventListener("mouseover", () => {
//     clearTimeout(setTimerID)
// })


export default toast;