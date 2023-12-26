const genreCont = document.querySelector(".s-g-box-cont")
const genreInput = document.querySelector("#genre-input")
const musicGenres = [
    'Pop',
    'Rock',
    'Hip Hop',
    'R&B',
    'Country',
    'Jazz',
    'Blues',
    'Electronic',
    'Reggae',
    'Classical',
    'Folk',
    'Indie',
    'Metal',
    'Punk',
    'Soul',
    'Funk',
    'Dance',
    'Alternative',
    'Gospel',
    'World Music',
];

musicGenres.forEach((element,index,arr)=>{
    const span = document.createElement("span")
    span.classList.add("s-g-box")
    span.innerText = element
    genreCont.append(span)
})

genreCont.addEventListener("click",function(e){
    genreInput.value = e.target.innerText;
})