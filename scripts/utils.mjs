// These two functions were taken from the "Sleep-Outside" project, the rest of the functions were written by me.

// retrieve data from localstorage
export function getLocalStorage(key) {
    return JSON.parse(localStorage.getItem(key));
}
// save data to local storage
export function setLocalStorage(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}