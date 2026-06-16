// main.mjs AKA UI Controller

import Almanac from "./Almanac.mjs";
import SunriseSunset from "./externalServices.mjs"
import { toggleCompactView } from "./utils.mjs";

const almanac = new Almanac();
const sunriseSunset = new SunriseSunset();

// Initialize 
almanac.init()
sunriseSunset.init();

// EVENT LISTENERS //

// listen for clicks on the "Edit Note" button and call the edit note function when clicked
const editNoteBtn = document.querySelector("#edit-note-btn");
editNoteBtn.addEventListener("click", () => {
    almanac.editNote();
});

// listen for clicks on the "nextNote" button and call the corresponding function
const nextNoteBtn = document.querySelector("#next-note-btn");
nextNoteBtn.addEventListener("click", () => {
    almanac.getNextEntry();
});

// listen for clicks on the "prevNote" button and call the corresponding function
const prevNoteBtn = document.querySelector("#prev-note-btn");
prevNoteBtn.addEventListener("click", () => {
    almanac.getPreviousEntry();
});

// export btn
const exportBtn = document.querySelector("#export-btn");
exportBtn.addEventListener("click", () => {
    almanac.exportAlmanac();
});

// import btn
const importBtn = document.querySelector("#import-btn");
importBtn.addEventListener("click", () => {
    almanac.importAlmanac();
});

// go to date
// pendiente

// switch theme
const themesBtn = document.querySelector("#theme-btn");
themesBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
});



// toggle favorite btn
const toggleFavBtn = document.querySelector("#toggle-favorite-btn")
toggleFavBtn.addEventListener("click", () => {
    almanac.toggleFavorite();
});

// compact view
const compactBtn = document.querySelector("#compact-btn");
compactBtn.addEventListener("click", () => {
    toggleCompactView()
});
