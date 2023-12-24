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