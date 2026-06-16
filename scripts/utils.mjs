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
    const stats = document.querySelector(".stats-wrapper");

    header.classList.toggle("closed")
    quote.classList.toggle("closed")
    quoteCredits.classList.toggle("closed")
    stats.classList.toggle("closed")

}

function triggerPageFlip(direction) {
    // def elements
    const mainWrapper = document.querySelector(".main-wrapper")

    // change the origin of the animation depending on thge direction
    mainWrapper.style.transformOrigin = direction === "next" ? "left center" : "right center";

    mainWrapper.classList.add("page-flip");

    // remove thea animation once it plays out
    mainWrapper.addEventListener("animationend", () => {
        mainWrapper.classList.remove("page-flip");
    }, { once: true });
}



export { getLocalStorage, setLocalStorage, toggleCompactView, triggerPageFlip };