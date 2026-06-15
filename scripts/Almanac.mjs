import { getLocalStorage, setLocalStorage } from "./utils.mjs";
// import Entry from "./Entry.mjs";


// TO-DO
// Handle next/previous day navigation (page-flip effect).
// Handle “Go to Date” search.

export default class Almanac {
    constructor() {
        this.currentDate = new Date();
        this.entries = getLocalStorage("entries") || {};
        this.defaultText = "Tap the edit button to add a note."
    }

    // Function used to display the current date
    displayDate() {
        // define elements
        const dayDisplay = document.getElementById("day-display");
        const monthYearDispay = document.getElementById("month-year-display");

        // format day, month, and year
        const weekdayFormatter = new Intl.DateTimeFormat("en-US", { weekday: "long" });
        const dayFormatter = new Intl.DateTimeFormat("en-US", { day: "2-digit" });
        const monthYearFormatter = new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" });

        const dayName = weekdayFormatter.format(this.currentDate);
        const dayNumber = dayFormatter.format(this.currentDate);
        const monthYear = monthYearFormatter.format(this.currentDate);

        // display formatted date
        dayDisplay.textContent = `${dayName}, ${dayNumber}`;
        monthYearDispay.textContent = monthYear;
    }

    displayNote() {
        // define default entry text
        let entryText = this.defaultText;

        // get the entry for currentDate
        if (this.entries[this.formatDate(this.currentDate)]) {
            entryText = this.entries[this.formatDate(this.currentDate)]
        }

        // define the element
        const entryDisplay = document.querySelector(".entry");

        // display the text
        entryDisplay.textContent = entryText
    }

    async displayQuote() {
        // define default quote text and author
        let quoteText = "There's more to life than being a passenger.";
        let authorText = "Amelia Earhart"

        // get a random quote and author from the downloaded quotes
        const res = await fetch("./quotes.json");
        const quotes = await res.json();
        const random = quotes[Math.floor(Math.random() * quotes.length)];

        // define the elements
        const quoteDisplay = document.querySelector(".quoteText");
        const authorDisplay = document.querySelector(".author");

        // display the text
        quoteDisplay.textContent = random.q
        authorDisplay.textContent = random.a
    }

    saveNote(textareaElement) {

        // get the updated text from the textarea
        const updatedText = textareaElement.value;
        // create a new paragraph element and set its text content to the updated text
        const updatedEntryDisplay = document.createElement("p");
        updatedEntryDisplay.classList.add("entry");
        updatedEntryDisplay.textContent = updatedText;

        // replace the textarea with the updated entry
        textareaElement.replaceWith(updatedEntryDisplay);

        // store the entry in the entries property, using the current date as the key and the text as the value
        this.entries[this.formatDate(this.currentDate)] = updatedText;

        // store the updated entries object in local storage
        setLocalStorage("entries", this.entries);
    }

    editNote() {

        // get the note entry element & savebtn element
        const entry = document.querySelector(".entry");
        const saveBtn = document.querySelector("#save-note-btn");

        // define a default, empty value
        let entryText = ""

        // if the content of the entry<p> IS NOT the same as the default text...
        if (entry.textContent != this.defaultText) {

            // store the text content of the entry<p> in a variable
            entryText = entry.textContent;
        }

        // create a textarea element and set its value to the entry text
        const textarea = document.createElement("textarea");
        textarea.value = entryText;

        // replace the entry element with the textarea
        entry.replaceWith(textarea);

        // listen for the "blur" event on the textarea (when it loses focus)
        // textarea.addEventListener("blur", () => {
        //     this.saveNote(textarea);
        // });
        // disabled, caused duplicate calls on the saveNote() function

        saveBtn.addEventListener("click", () => {
            this.saveNote(textarea);
        });

    }

    importAlmanac() {

        // Create a <input> element to upload the file
        const input = document.createElement("input")
        input.type = "file"
        input.accept = ".json"
        input.click();

        input.addEventListener("change", () => {
            const file = input.files[0];
            if (!file) {
                console.log("No file selected")
                return
            };

            const reader = new FileReader();
            reader.readAsText(file);
            reader.onload = () => {

                const text = JSON.parse(reader.result)

                // DEVELOPMENT PURPOSES - REMOVE LATER
                console.log(text)

                // store the updated entries in local storage
                this.entries = text;
                setLocalStorage("entries", this.entries);
            };

            reader.onerror = () => {
                console.error("Error caught while reading:", reader.error);
            };
        });

        this.displayNote()
    }

    exportAlmanac() {
        // create a blob with the entries as the data and a temporary url to export it
        const blob = new Blob([JSON.stringify(this.entries, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob)

        const link = document.createElement("a")
        link.href = url
        link.download = 'almanacEntries.json'
        link.click();
        URL.revokeObjectURL(url);
    }

    getPreviousEntry() {
        // go back a day
        this.currentDate.setDate(this.currentDate.getDate() - 1)

        // refresh date & note display
        this.displayDate()
        this.displayNote()
        this.displayQuote()
    }

    getNextEntry() {
        // advance a day
        this.currentDate.setDate(this.currentDate.getDate() + 1)

        // refresh date & note display
        this.displayDate()
        this.displayNote()
        this.displayQuote()
    }

    goToDate() {
        // pendiente
    }

    deleteEntry() {
        // pendiente
    }

    formatDate(date) {
        return date.toISOString().split("T")[0]
    }
}



/* manera vieja, cuando no era object-oriented.
export default function displayDate() {
    // define elements
    const dayDisplay = document.getElementById("day-display");
    const monthYearDispay = document.getElementById("month-year-display");

    // get current date
    const date = new Date();

    // format day, month, and year
    const weekdayFormatter = new Intl.DateTimeFormat("en-US", { weekday: "long" });
    const dayFormatter = new Intl.DateTimeFormat("en-US", { day: "2-digit" });
    const monthYearFormatter = new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" });

    const dayName = weekdayFormatter.format(date);
    const dayNumber = dayFormatter.format(date);
    const monthYear = monthYearFormatter.format(date);

    // display formatted date
    dayDisplay.textContent = `${dayName}, ${dayNumber}`;
    monthYearDispay.textContent = monthYear;
}
*/