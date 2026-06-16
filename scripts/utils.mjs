// These two functions were taken from the "Sleep-Outside" project, the rest of the functions were written by me.

// retrieve data from localstorage
function getLocalStorage(key) {
    return JSON.parse(localStorage.getItem(key));
}
// save data to local storage
function setLocalStorage(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

// toggle Compact View
function toggleCompactView() {

    // define elements
    const header = document.querySelector("#header")
    const quote = document.querySelector(".quotes-wrapper")
    const quoteCredits = document.querySelector("#quote-credits")

    header.classList.toggle("closed")
    quote.classList.toggle("closed")
    quoteCredits.classList.toggle("closed")

}



export { getLocalStorage, setLocalStorage, toggleCompactView };