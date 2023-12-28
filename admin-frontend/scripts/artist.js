import { Role } from "appwrite";
import { ID, databases, Query, Permission } from "../appwrite/config";
import { ARTIST_COLLECTION_ID, DATABASE_ID } from "../utils/secret";
let limit = 10;
let page = 1;
let totalDocuments = 0;

(async () => {
    try {
        const artistsArr = await databases.listDocuments(DATABASE_ID, ARTIST_COLLECTION_ID,
            [
                Query.limit(limit),
                Query.offset((page - 1) * limit)
            ]
        );
        if (artistsArr.documents.length === 0) return;
        totalDocuments = artistsArr.total;
        LAST_ID = artistsArr.documents[artistsArr.documents.length - 1].$id;
        artistsArr.documents.forEach((artist, index) => {
            const artistRow = handleartistRowHTMLCreate(artist.name, artist.$id)
            artistBox.append(artistRow)
        })
    } catch (error) {
        console.log(error);
    }


})()

import toast from "../utils/toast";
const artistCont = document.querySelector(".a-g-box-cont");
const artistInput = document.querySelector("#artist-input");
const createBtn = document.querySelector("#create-btn");
const updateBtn = document.querySelector("#update-btn");
const artistBox = document.querySelector(".artist-box");
const leftArrow = document.querySelector(".left-arrow")
const rightArrow = document.querySelector(".right-arrow")
const pageNo = document.querySelector(".page-no")
let DOCUMENT_ID = null;
let selectedArtistForUpdate = null;
let LAST_ID = null;
const musicArtist = ['Pop', 'Rock', 'Hip Hop', 'R&B', 'Country', 'Jazz', 'Blues', 'Electronic', 'Reggae', 'Classical', 'Folk', 'Indie', 'Metal', 'Punk', 'Soul', 'Funk', 'Dance', 'Alternative', 'Gospel', 'World Music',];

musicArtist.forEach((element, index, arr) => {
    const span = document.createElement("span")
    span.classList.add("s-g-box")
    span.innerText = element
    artistCont.append(span)
})

artistCont.addEventListener("click", function (e) {
    if (musicArtist.includes(e.target.innerText)) {
        artistInput.value = e.target.innerText;
    }
})

createBtn.addEventListener("click", async function () {

    if (artistInput.value.trim().length === 0) {
        return toast(false, "Artist name required !!")
    }
    try {
        this.innerHTML = `<span class="loader"></span>`
        const response = await databases.createDocument(DATABASE_ID, ARTIST_COLLECTION_ID, ID.unique(), { name: artistInput.value.toLowerCase() }
            , [
                Permission.read(Role.any()),
                Permission.update(Role.any()),
                Permission.delete(Role.any())
            ]
        );
        const artistRow = await handleartistRowHTMLCreate(artistInput.value, response.$id)
        let totalDocumentOnPage = artistBox.querySelectorAll(".artist-row").length

        if (limit !== totalDocumentOnPage && artistRow) {
            artistBox.append(artistRow)
            totalDocumentOnPage += 1;
            if (page < Math.ceil(totalDocuments / limit)) {
            } else {
                console.log(45);
                if (limit === totalDocumentOnPage) {
                    totalDocuments += 1;
                }
            }
        }

        toast(true, "Artist added successfully")
        createBtn.innerHTML = "Create Artist"
        artistInput.value = ""
    } catch (error) {
        createBtn.innerHTML = "Create Artist"
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
    if (artistInput.value.trim().length === 0) {
        return toast(false, "Artist name required !!")
    }
    try {
        this.innerHTML = `<span class="loader"></span>`
        const response = await databases.updateDocument(DATABASE_ID, ARTIST_COLLECTION_ID, DOCUMENT_ID, { name: artistInput.value.toLowerCase() });
        toast(true, "Artist updated successfully")
        updateBtn.innerHTML = "Update Artist";
        selectedArtistForUpdate.innerText = artistInput.value;
        artistInput.value = ""
        toggleCreateUpdateBtn(false)
    } catch (error) {
        updateBtn.innerHTML = "Update Artist"
        if (error.type = "document_already_exists") {
            toast(false, "Already exists")
        }
        return console.log(error);
    }

})


// 🔥🔥🔥🔥🔥 Function Number 1 🔥🔥🔥🔥🔥
const handleartistRowHTMLCreate = (artist, _id) => {
    const artistRow = createElmeAndAddClasses("div", ["artist-row"])
    const artistName = createElmeAndAddClasses("div", ["a-name"], artist)
    const artistActionBtnBox = createElmeAndAddClasses("div", ["a-action-btn", "flex-g-10"])
    artistActionBtnBox._id = _id;
    const artistEdit = createElmeAndAddClasses("div", ["material-symbols-outlined", "edit",], "edit")
    const artistDelete = createElmeAndAddClasses("div", ["material-symbols-outlined", "delete"], "delete")
    artistRow.append(artistName)
    artistRow.append(artistActionBtnBox)
    artistActionBtnBox.append(artistEdit)
    artistActionBtnBox.append(artistDelete)
    return artistRow;
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

artistBox.addEventListener("click", async function (e) {
    if (e.target.className.includes("edit")) {
        const artistForUpdate = e.target.parentNode.previousElementSibling.innerText;
        DOCUMENT_ID = e.target.parentNode._id;
        artistInput.value = artistForUpdate;
        toggleCreateUpdateBtn(true);
        selectedArtistForUpdate = e.target.parentNode.previousElementSibling;
    } else if (e.target.className.includes("delete")) {
        try {
            console.log(e.target.parentNode._id);
            const result = await databases.deleteDocument(DATABASE_ID, ARTIST_COLLECTION_ID, e.target.parentNode._id + "");
            e.target.parentNode.previousElementSibling.parentNode.remove()
            return toast(true, "Artist Deleted Successfully !!")
        } catch (error) {
            console.log(error);
            return toast(false, "Error while deleting Artist !!")
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
        const artistsArr = await databases.listDocuments(DATABASE_ID, ARTIST_COLLECTION_ID,
            [
                Query.limit(limit),
                Query.cursorAfter(LAST_ID)
            ]
        );

        if (artistsArr.documents.length !== 0) {
            const artistRows = artistBox.querySelectorAll(".artist-row")
            artistRows.forEach((elem) => {
                artistBox.removeChild(elem)
            })
            page = page + 1
            pageNo.innerText = page;
            LAST_ID = artistsArr.documents[artistsArr.documents.length - 1].$id;
            artistsArr.documents.forEach((artist, index) => {
                const artistRow = handleartistRowHTMLCreate(artist.name, artist.$id)
                artistBox.append(artistRow)
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
        const artistsArr = await databases.listDocuments(DATABASE_ID, ARTIST_COLLECTION_ID,
            [
                Query.limit(limit),
                Query.offset((page - 1) * limit)
            ]
        );

        if (artistsArr.documents.length !== 0) {
            const artistRows = artistBox.querySelectorAll(".artist-row")
            artistRows.forEach((elem) => {
                artistBox.removeChild(elem)
            })
            pageNo.innerText = page;
            LAST_ID = artistsArr.documents[artistsArr.documents.length - 1].$id;
            artistsArr.documents.forEach((artist, index) => {
                const artistRow = handleartistRowHTMLCreate(artist.name, artist.$id)
                artistBox.append(artistRow)
            })

        }

    } catch (error) {
        console.log(error);
    }
})


