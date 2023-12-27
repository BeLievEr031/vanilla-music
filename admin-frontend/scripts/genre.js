import { ID, databases, Query } from "../appwrite/config";
let limit = 10;
let page = 1;
let totalDocuments = 0;

(async () => {
    try {
        const genresArr = await databases.listDocuments(DATABASE_ID, COLLECTION_ID,
            [
                Query.limit(limit),
                Query.offset((page - 1) * limit)
            ]
        );
        totalDocuments = genresArr.total;
        // console.log(genresArr);
        LAST_ID = genresArr.documents[genresArr.documents.length - 1].$id;
        genresArr.documents.forEach((genre, index) => {
            const genreRow = handleGenreRowHTMLCreate(genre.name, genre.$id)
            genreBox.append(genreRow)
        })
    } catch (error) {
        console.log(error);
    }


})()

import { COLLECTION_ID, DATABASE_ID } from "../utils/secret";
import toast from "../utils/toast";
const genreCont = document.querySelector(".s-g-box-cont");
const genreInput = document.querySelector("#genre-input");
const createBtn = document.querySelector("#create-btn");
const updateBtn = document.querySelector("#update-btn");
const genreBox = document.querySelector(".genre-box");
const leftArrow = document.querySelector(".left-arrow")
const rightArrow = document.querySelector(".right-arrow")
const pageNo = document.querySelector(".page-no")
let DOCUMENT_ID = null;
let selectedGenreForUpdate = null;
let LAST_ID = null;
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
        const genreRow = await handleGenreRowHTMLCreate(genreInput.value, response.$id)
        let totalDocumentOnPage = genreBox.querySelectorAll(".genre-row").length

        if (limit !== totalDocumentOnPage && genreRow) {
            genreBox.append(genreRow)
            totalDocumentOnPage += 1;
            if (page < Math.ceil(totalDocuments / limit)) {
            } else {
                console.log(45);
                if (limit === totalDocumentOnPage) {
                    totalDocuments += 1;
                }
            }
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

genreBox.addEventListener("click", async function (e) {
    if (e.target.className.includes("edit")) {
        const genreForUpdate = e.target.parentNode.previousElementSibling.innerText;
        DOCUMENT_ID = e.target.parentNode._id;
        genreInput.value = genreForUpdate;
        toggleCreateUpdateBtn(true);
        selectedGenreForUpdate = e.target.parentNode.previousElementSibling;
    } else if (e.target.className.includes("delete")) {
        try {
            console.log(e.target.parentNode._id);
            const result = await databases.deleteDocument(DATABASE_ID, COLLECTION_ID, e.target.parentNode._id);
            e.target.parentNode.previousElementSibling.parentNode.remove()
            return toast(true, "Genre Deleted Successfully !!")
        } catch (error) {
            console.log(error);
            return toast(false, "Error while deleting genre !!")
        }
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

rightArrow.addEventListener("click", async () => {
    console.log(totalDocuments);
    if (page < Math.ceil(totalDocuments / limit)) {
    } else {
        return toast(false, "You are on last page");
    }
    try {
        const genresArr = await databases.listDocuments(DATABASE_ID, COLLECTION_ID,
            [
                Query.limit(limit),
                Query.cursorAfter(LAST_ID)
            ]
        );

        if (genresArr.documents.length !== 0) {
            const genreRows = genreBox.querySelectorAll(".genre-row")
            genreRows.forEach((elem) => {
                genreBox.removeChild(elem)
            })
            page = page + 1
            pageNo.innerText = page;
            LAST_ID = genresArr.documents[genresArr.documents.length - 1].$id;
            genresArr.documents.forEach((genre, index) => {
                const genreRow = handleGenreRowHTMLCreate(genre.name, genre.$id)
                genreBox.append(genreRow)
            })

        }

    } catch (error) {
        console.log(error);
    }
})

leftArrow.addEventListener("click", async () => {
    if (page === 1) {
        return toast(false, "You are on first page !!");
    }
    try {
        page = page - 1
        const genresArr = await databases.listDocuments(DATABASE_ID, COLLECTION_ID,
            [
                Query.limit(limit),
                Query.offset((page - 1) * limit)
            ]
        );

        if (genresArr.documents.length !== 0) {
            const genreRows = genreBox.querySelectorAll(".genre-row")
            genreRows.forEach((elem) => {
                genreBox.removeChild(elem)
            })
            pageNo.innerText = page;
            LAST_ID = genresArr.documents[genresArr.documents.length - 1].$id;
            genresArr.documents.forEach((genre, index) => {
                const genreRow = handleGenreRowHTMLCreate(genre.name, genre.$id)
                genreBox.append(genreRow)
            })

        }

    } catch (error) {
        console.log(error);
    }
})


