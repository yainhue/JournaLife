// main.mjs AKA UI Controller

// OLD IMPORTS
// import displayDate from "./Almanac.mjs";
// import editNote from "./Entry.mjs";=
// displayDate();

// new imports
import Almanac from "./Almanac.mjs";

const almanac = new Almanac();

// Display current date (TEMPORAL, ADAPTAR LUEGO!)
almanac.displayDate();

// Display current note
almanac.displayNote();


// EVENT LISTENERS //

// listen for clicks on the "Edit Note" button and call the edit note function when clicked
const editNoteBtn = document.querySelector("#edit-note-btn");
editNoteBtn.addEventListener("click", () => {
    almanac.editNote();
});

// listen for clicks on the "Save Note" button and call the save note function when clicked
// const saveNoteBtn = document.querySelector("#save-note-btn");
// saveNoteBtn.addEventListener("click", () => {
//     almanac.saveNote();
// });
// Need to work on this... La funcion depende de un text area, pero si no hay textarea selecionado
//  como va a guardar la nota? ... pasarle ID?

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