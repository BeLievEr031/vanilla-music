import { ID, databases } from "../appwrite/config";
import { COLLECTION_ID, DATABASE_ID } from "../utils/secret";
import toast from "../utils/toast";
const genreCont = document.querySelector(".s-g-box-cont")
const genreInput = document.querySelector("#genre-input")
const createBtn = document.querySelector("#create-btn")
const genreBox = document.querySelector(".genre-box")

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
    this.innerHTML = `<span class="loader"></span>`
    const genreRow = await handleGenreRowHTMLCreate(genreInput.value)
    if (genreRow) {
        genreBox.append(genreRow)
    }
    genreInput.value = ""
})

// 🔥🔥🔥🔥🔥 Function Number 1 🔥🔥🔥🔥🔥
const handleGenreRowHTMLCreate = async (genre) => {

    try {
        const response = await databases.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), { name: genre });
        console.log(response);
        const genreRow = createElmeAndAddClasses("div", ["genre-row"])
        const genreName = createElmeAndAddClasses("div", ["g-name"], genre)
        const genreActionBtnBox = createElmeAndAddClasses("div", ["g-action-btn", "flex-g-10"])
        const genreEdit = createElmeAndAddClasses("div", ["edit"], "", `<span class="material-symbols-outlined"> edit </span>`)
        const genreDelete = createElmeAndAddClasses("div", ["delete"], "", `<span class="material-symbols-outlined"> delete </span>`)
        genreRow.append(genreName)
        genreRow.append(genreActionBtnBox)
        genreActionBtnBox.append(genreEdit)
        genreActionBtnBox.append(genreDelete)
        toast(true, "Genre added successfully")
        createBtn.innerHTML = "Create Genre"

        return genreRow;
    } catch (error) {
        // console.log(error.message); // Failure
        createBtn.innerHTML = "Create Genre"
        toast(false, "Already exists")
        if (error.type = "document_already_exists") {
            console.log(45);
        }
    }

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