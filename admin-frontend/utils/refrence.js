const refreceForHandleGenreRowHTMLCreateFunction = () => {
    // file Name genre.js
    // 🔥🔥🔥🔥🔥 Function Number 1 🔥🔥🔥🔥🔥

    // const genreRow = document.createElement("div")
    // genreRow.classList.add("genre-row")


    // const genreName = document.createElement("div")
    // genreName.classList.add("g-name")
    // genreName.innerText = genre;



    // const genreActionBtnBox = document.createElement("div")
    // genreActionBtnBox.classList.add("g-action-btn")
    // genreActionBtnBox.classList.add("flex-g-10")

    // const genreEdit = document.createElement("div")
    // genreEdit.classList.add("edit")
    // genreEdit.innerHTML = `<span class="material-symbols-outlined"> edit </span>`


    // const genreDelete = document.createElement("div")
    // genreDelete.classList.add("delete")
    // genreDelete.innerHTML = `<span class="material-symbols-outlined"> delete </span>`
}




const dragAndDropRefrence = () => {

    // Prevent default behaviors for drag events
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, preventDefaults, false);
        document.body.addEventListener(eventName, preventDefaults, false);
    });


    // Highlight drop area when dragging over it
    ['dragenter', 'dragover'].forEach(eventName => {
        dropArea.addEventListener(eventName, highlight, false);
    });


    // Remove highlighting when leaving the drop area
    ['dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, unhighlight, false);
    });
}