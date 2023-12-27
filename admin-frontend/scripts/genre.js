
(async () => {
    const genresArr = await databases.listDocuments(DATABASE_ID, COLLECTION_ID);
    console.log(genresArr);
    genresArr.documents.forEach((genre, index) => {
        const genreRow = handleGenreRowHTMLCreate(genre.name, genre.$id)
        genreBox.append(genreRow)
    })

})()

import { ID, databases } from "../appwrite/config";
import { COLLECTION_ID, DATABASE_ID } from "../utils/secret";
import toast from "../utils/toast";
const genreCont = document.querySelector(".s-g-box-cont");
const genreInput = document.querySelector("#genre-input");
const createBtn = document.querySelector("#create-btn");
const updateBtn = document.querySelector("#update-btn");
const genreBox = document.querySelector(".genre-box");
let DOCUMENT_ID = null;
let selectedGenreForUpdate = null;
const musicGenres = ['Pop', 'Rock', 'Hip Hop', 'R&B', 'Country', 'Jazz', 'Blues', 'Electronic', 'Reggae', 'Classical', 'Folk', 'Indie', 'Metal', 'Punk', 'Soul', 'Funk', 'Dance', 'Alternative', 'Gospel', 'World Music',];

musicGenres.forEach((element, index, arr) => {
    const span = document.createElement("span")
    span.classList.add("s-g-box")
    span.innerText = element
    genreCont.append(span)
})

genreCont.addEventListener("click", function (e) {
    if (musicGenres.includes(e.target.innerText)) {
        genreInput.value = e.target.innerText;
    }
})

createBtn.addEventListener("click", async function () {

    if (genreInput.value.trim().length === 0) {
        return toast(false, "Genre name required !!")
    }
    try {
        this.innerHTML = `<span class="loader"></span>`
        const response = await databases.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), { name: genreInput.value.toLowerCase() });
        console.log(response);
        const genreRow = await handleGenreRowHTMLCreate(genreInput.value, response.$id)
        if (genreRow) {
            genreBox.append(genreRow)
        }
        toast(true, "Genre added successfully")
        createBtn.innerHTML = "Create Genre"
        genreInput.value = ""
    } catch (error) {
        createBtn.innerHTML = "Create Genre"
        if (error.type = "document_already_exists") {
            toast(false, "Already exists")
        }
        return console.log(error);
    }


})


updateBtn.addEventListener("click", async function () {
    if (!DOCUMENT_ID) {
        return toast(false, "DOCUMENT_ID must be provided !!")
    }
    if (genreInput.value.trim().length === 0) {
        return toast(false, "Genre name required !!")
    }
    try {
        this.innerHTML = `<span class="loader"></span>`
        const response = await databases.updateDocument(DATABASE_ID, COLLECTION_ID, DOCUMENT_ID, { name: genreInput.value.toLowerCase() });
        toast(true, "Genre updated successfully")
        updateBtn.innerHTML = "Update Genre";
        selectedGenreForUpdate.innerText = genreInput.value;
        genreInput.value = ""
        toggleCreateUpdateBtn(false)
    } catch (error) {
        updateBtn.innerHTML = "Update Genre"
        if (error.type = "document_already_exists") {
            toast(false, "Already exists")
        }
        return console.log(error);
    }

})

// 🔥🔥🔥🔥🔥 Function Number 1 🔥🔥🔥🔥🔥
const handleGenreRowHTMLCreate = (genre, _id) => {
    const genreRow = createElmeAndAddClasses("div", ["genre-row"])
    const genreName = createElmeAndAddClasses("div", ["g-name"], genre)
    const genreActionBtnBox = createElmeAndAddClasses("div", ["g-action-btn", "flex-g-10"])
    genreActionBtnBox._id = _id;
    const genreEdit = createElmeAndAddClasses("div", ["material-symbols-outlined", "edit",], "edit")
    const genreDelete = createElmeAndAddClasses("div", ["material-symbols-outlined", "delete"], "delete")
    genreRow.append(genreName)
    genreRow.append(genreActionBtnBox)
    genreActionBtnBox.append(genreEdit)
    genreActionBtnBox.append(genreDelete)
    return genreRow;
}

const createElmeAndAddClasses = (elem, classes = [], innerText = "", innerHTML = null) => {
    const createdElement = document.createElement(elem);
    classes.forEach((className, index) => {
        createdElement.classList.add(className);
    })
    if (innerText) {
        createdElement.innerText = innerText;
    }
    if (innerHTML !== null && innerHTML !== "") {
        createdElement.innerHTML = innerHTML;
    }
    return createdElement;
}

genreBox.addEventListener("click", function (e) {
    if (e.target.className.includes("edit")) {
        const genreForUpdate = e.target.parentNode.previousElementSibling.innerText;
        console.log(45);
        DOCUMENT_ID = e.target.parentNode._id;
        genreInput.value = genreForUpdate;
        toggleCreateUpdateBtn(true);
        selectedGenreForUpdate = e.target.parentNode.previousElementSibling;
    }
    return;
})

const toggleCreateUpdateBtn = (isUpdate) => {
    if (isUpdate) {
        createBtn.classList.remove("active-btn")
        createBtn.classList.add("unactive-btn")

        updateBtn.classList.remove("unactive-btn")
        updateBtn.classList.add("active-btn")
    } else {
        updateBtn.classList.remove("active-btn")
        updateBtn.classList.add("unactive-btn")

        createBtn.classList.remove("unactive-btn")
        createBtn.classList.add("active-btn")
    }
}