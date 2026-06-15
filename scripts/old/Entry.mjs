// import as needed
import { getLocalStorage, setLocalStorage } from "./utils.mjs";




export default class Entry {
    constructor(note = "Tap the edit button to add a note.") {
        // this.date = new Date();
        this.note = note;
    }
}

// cada dia tiene una nota vacia correspondiente como default si no tiene algo agregado por el usuario



// backup de sistema antiguo
/*
// import as needed
import { getLocalStorage, setLocalStorage } from "./utils.mjs";

function saveNote(textareaElement) {
    // get the updated text from the textarea
    const updatedText = textareaElement.value;
    // create a new paragraph element and set its text content to the updated text
    const updatedEntry = document.createElement("p");
    updatedEntry.classList.add("entry");
    updatedEntry.textContent = updatedText;

    // replace the textarea with the updated entry
    textareaElement.replaceWith(updatedEntry);

    // get the current entries from local storage, or initialize an empty dictionary
    const currentEntries = getLocalStorage("entries") || {};





}



export default function editNote() {
    console.log("edit note function called"); ""

    // get the note entry element & savebtn element
    const entry = document.querySelector(".entry");
    const saveBtn = document.querySelector("#save-note-btn");

    // store the text content of the entry in a variable
    const entryText = entry.textContent;

    // create a textarea element and set its value to the entry text
    const textarea = document.createElement("textarea");
    textarea.value = entryText;

    // replace the entry element with the textarea
    entry.replaceWith(textarea);

    // listen for the "blur" event on the textarea (when it loses focus)
    textarea.addEventListener("blur", () => {
        saveNote(textarea);
    });

    saveBtn.addEventListener("click", () => {
        saveNote(textarea);
    });

}

// cada dia tiene una nota vacia correspondiente como default si no tiene algo agregado por el usuario
*/