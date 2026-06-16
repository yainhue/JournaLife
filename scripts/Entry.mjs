// import as needed
import { getLocalStorage, setLocalStorage } from "./utils.mjs";

export default class Entry {
    constructor(date, note) {
        this.date = date;
        this.note = note;
        this.favorite = false
        this.timesEdited = 0;
        this.timezoneId = Intl.DateTimeFormat().resolvedOptions().timeZone;
        this.lastModified = this.formatLastModDate();
        this.moodEmoji = "😀"
        this.wordCount = this.computeWordCount();
        this.readingTime = this.computeReadingTime();
    }

    computeWordCount() {
        // if the note doesn't exist, return 0
        if (!this.note) return 0;
        // else split by spaces and count
        return this.note.trim().split(/\s+/).length;
    }
    computeReadingTime() {
        // divide the word count by the average reading speed (200wpm)
        const minutes = this.wordCount / 200;
        // convert to seconds
        return Math.ceil(minutes * 60);
    }

    formatLastModDate() {
        const date = new Date()
        const dateFormatted = date.toLocaleString("en-US", {
            timeZone: this.timeZone,
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true
        });

        return dateFormatted
    }
}