import { getLocalStorage, setLocalStorage } from "./utils.mjs";
import Entry from "./Entry.mjs";

export default class Almanac {
    constructor() {
        this.currentDate = new Date();
        this.entries = getLocalStorage("entries") || {};
        this.defaultText = "Tap the edit button to add a note. After that,  tap on the emoji to change the mood";

        // call these once only
        this.setupFavoritesListeners()
        this.setupEmojiMoodListeners()
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
        // get current date key
        const dateKey = this.formatDate(this.currentDate);

        // define default entry text
        let entryText = this.defaultText;

        // get the entry for currentDate
        if (this.entries[dateKey]) {
            entryText = this.entries[dateKey].note
            this.displayFavorite()
        }

        // define the element
        const entryDisplay = document.querySelector(".entry");

        // display the text
        entryDisplay.innerHTML = entryText

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

    async saveNote(textareaElement) {
        // get current date key
        const dateKey = this.formatDate(this.currentDate);

        // get the updated text from the textarea
        const updatedText = textareaElement.value;

        // create a new paragraph element and set its text content to the updated text
        const updatedEntryDisplay = document.createElement("p");
        await updatedEntryDisplay.classList.add("entry");
        updatedEntryDisplay.textContent = updatedText;

        // replace the textarea with the updated entry
        textareaElement.replaceWith(updatedEntryDisplay);

        // get current entry (if it exists) or default to zero
        let newTimesEdited = 0;

        if (this.entries[dateKey]) {

            // adds to the the times edited 
            newTimesEdited = this.entries[dateKey].timesEdited + 1

        }

        // store the entry in the entries property, using the current date as the key and the text as the value
        // create a new entry object to store the entry text
        const entry = new Entry(dateKey, updatedText)

        this.entries[dateKey] = entry;

        // update last mod time
        this.entries[dateKey].lastModified = this.entries[dateKey].formatLastModDate();
        this.entries[dateKey].timesEdited = newTimesEdited;

        // store the updated entries object in local storage
        setLocalStorage("entries", this.entries);

        // update displays
        this.displayStats();
        this.displayEmojiMood();
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

        // enable the save button and disable it once used
        const handler = () => {
            this.saveNote(textarea);
            saveBtn.removeEventListener("click", handler)
        };

        saveBtn.addEventListener("click", handler);
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

                // DEBUG - REMOVE LATER
                console.log(text)

                // store the updated entries in local storage
                this.entries = text;
                setLocalStorage("entries", this.entries);

                // render imported entries
                this.displayNote()
            };

            reader.onerror = () => {
                console.error("Error caught while reading:", reader.error);
            };
        });
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
        this.init();
    }

    getNextEntry() {
        // advance a day
        this.currentDate.setDate(this.currentDate.getDate() + 1)

        // refresh date & note display
        this.init();
    }

    goToDate() {
        // def elements
        const goDateBtn = document.querySelector("#goto-btn");

        // create input type "date"
        const dateInput = document.createElement("input");
        dateInput.type = "date";
        dateInput.id = "goto-date-input";

        // replace the button with the input
        goDateBtn.replaceWith(dateInput);

        // when a date is chosen..
        dateInput.addEventListener("change", () => {
            // get input and convert to date obj
            const selectedDate = new Date(dateInput.value + "T00:00:00");

            // update current date
            this.currentDate = selectedDate;

            // run init to display everything related to that date
            this.init()

            // put the button back
            dateInput.replaceWith(goDateBtn);
        });
    }

    deleteEntry() {
        // pending
    }

    formatDate(date) {
        return date.toISOString().split("T")[0]
    }

    toggleFavorite() {
        // get current date key
        const dateKey = this.formatDate(this.currentDate);

        // get current entry
        const currentEntry = this.entries[dateKey];

        // if the entry actually exists...
        if (this.entries[dateKey]) {

            // if currentEntry is not a favorite 
            if (currentEntry.favorite == false) {
                // DEBUG
                // console.log("Entry is NOT a favorite, marking");

                // mark currentEntry as a favorite
                currentEntry.favorite = true

                // display button correctly
                this.displayFavorite()
            }

            // else, if currentEntry IS already a favorite
            else {
                // DEBUG
                // console.log("Entry IS a favorite, unmarking");

                // remove currentEntry as a favorite
                currentEntry.favorite = false

                // display button correctly
                this.displayFavorite()
            }

            // store the updated entries object in local storage
            setLocalStorage("entries", this.entries);

            // update favorites list
            this.populateFavorites()
        }

        // if the entry doesn't exist, do nothing!
    }

    displayFavorite() {
        // get current date key
        const dateKey = this.formatDate(this.currentDate);

        // get current entry
        const currentEntry = this.entries[dateKey]

        // define button
        const toggleFavBtn = document.querySelector("#toggle-favorite-btn")


        // if the entry actually exists...
        if (this.entries[dateKey]) {

            // if currentEntry is not a favorite 
            if (currentEntry.favorite == false) {

                toggleFavBtn.className = "unmarked";

            }

            // else, if currentEntry IS already a favorite
            else {

                toggleFavBtn.className = "marked";

            }
        }
        else {
            toggleFavBtn.className = "unmarked";
        }

    }

    populateFavorites() {
        const favoritesList = document.getElementById("favorites-dropdown-list");
        favoritesList.innerHTML = "";

        // for each entry on entries, check for favorites and populate
        Object.values(this.entries).forEach(entry => {

            if (entry.favorite == true) {
                const li = document.createElement("li");
                li.textContent = entry.date;
                li.setAttribute("role", "button");
                li.setAttribute("tabindex", "0");
                favoritesList.appendChild(li);
            }

        });

        favoritesList.querySelectorAll("li").forEach(item => {
            item.addEventListener("click", () => {

                // get the date from the option
                const entryDate = new Date(item.textContent)
                entryDate.setMinutes(entryDate.getMinutes() + entryDate.getTimezoneOffset());

                // pass the date to the currentDate and run init()
                this.currentDate = entryDate;
                this.init()

                favoritesList.classList.remove("show");
            });
        });

    }

    setupFavoritesListeners() {
        // define elements
        const favoritesBtn = document.getElementById("favorites-dropdown-btn");
        const favoritesList = document.getElementById("favorites-dropdown-list");

        favoritesBtn.addEventListener("click", () => {
            favoritesList.classList.toggle("show");
        });

    }

    displayEmojiMood() {
        // def element
        const emojiDisplay = document.querySelector("#emoji-mood-display")

        // get current date key
        const dateKey = this.formatDate(this.currentDate);

        if (this.entries[dateKey]) {
            emojiDisplay.textContent = this.entries[dateKey].moodEmoji
        }

        else {
            emojiDisplay.textContent = "😀"
        }
    }

    setupEmojiMoodListeners() {
        // define elements
        const emojiDisplay = document.querySelector("#emoji-mood-display")
        const emojiArray = ["😅", "😥", "😎", "😀", "🤔"]

        // get current date key
        const dateKey = this.formatDate(this.currentDate);

        emojiDisplay.addEventListener("click", () => {

            const randIndex = Math.floor(Math.random() * 4)

            if (this.entries[dateKey]) {
                this.entries[dateKey].moodEmoji = emojiArray[randIndex]

            }

            else {
                emojiDisplay.textContent = "😀"
            }

            this.displayEmojiMood()

        });

    }

    displayStats() {
        // def elements
        const wordCountDisplay = document.querySelector("#word-count-display")
        const readingTimeDisplay = document.querySelector("#reading-time-display")
        const lastModDisplay = document.querySelector("#last-mod-display")
        const timesEditedDisplay = document.querySelector("#times-edited-display")


        // get current date key
        const dateKey = this.formatDate(this.currentDate);

        // if the entry exists..
        if (this.entries[dateKey]) {
            // display stats
            let wordCount = this.entries[dateKey].wordCount;
            let readingTime = this.entries[dateKey].readingTime;
            let lastMod = this.entries[dateKey].lastModified;
            let timesEdited = this.entries[dateKey].timesEdited;

            wordCountDisplay.className = "stats-enabled"
            readingTimeDisplay.className = "stats-enabled"
            lastModDisplay.className = "stats-enabled"
            timesEditedDisplay.className = "stats-enabled"


            wordCountDisplay.textContent = wordCount + " Words";
            readingTimeDisplay.textContent = readingTime + " seconds to read";
            lastModDisplay.textContent = "Last Modified: " + lastMod;
            timesEditedDisplay.textContent = "Times Edited: " + timesEdited;
        }

        // if it does not
        else {
            wordCountDisplay.textContent = "Word Count";
            readingTimeDisplay.textContent = "Reading Time";
            lastModDisplay.textContent = "Last Modified";
            timesEditedDisplay.textContent = "Times Edited";

            wordCountDisplay.className = "stats-disabled"
            readingTimeDisplay.className = "stats-disabled"
            lastModDisplay.className = "stats-disabled"
            timesEditedDisplay.className = "stats-disabled"
        }

    }

    init() {
        this.displayDate()
        this.displayQuote()
        this.displayNote()
        this.displayFavorite()
        this.populateFavorites()
        this.displayEmojiMood()
        this.setupEmojiMoodListeners()
        this.displayStats()
    }


}