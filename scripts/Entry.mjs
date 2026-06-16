// import as needed
import { getLocalStorage, setLocalStorage } from "./utils.mjs";

export default class Entry {
    constructor(date, note) {
        this.date = date;
        this.note = note;
        this.favorite = false
        this.tags = []
        this.history = []
        this.lastModified = new Date().toISOString()
        this.moodEmoji = "😀"
        this.wordCount = 0;
        this.readingTime = 0;
    }
}