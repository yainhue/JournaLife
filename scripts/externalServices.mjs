import { getLocalStorage, setLocalStorage } from "./utils.mjs";

export default class SunriseSunset {
    constructor() {
        // define default, empty, fallback values
        let fallback = { sunrise: "", sunset: "" }

        // if fallback is available on local storage ... else, keep the default fallback
        if (getLocalStorage("sunriseSunsetFallback")) {

            // get it and set it as the new fallback
            fallback = getLocalStorage("sunriseSunsetFallback")

        }

        this.latitude = 0;
        this.longitude = 0;
        this.timezoneId = "";

        // try to load from the fallback, if the fallback is empty it will default to empty values
        this.sunrise = fallback.sunrise ? new Date(fallback.sunrise) : "";
        this.sunset = fallback.sunset ? new Date(fallback.sunset) : "";

        this.currentDateNow = "";
    }


    async getCoordinates() {
        if ("geolocation" in navigator) {
            try {
                const position = await new Promise((resolve, reject) => {
                    navigator.geolocation.getCurrentPosition(resolve, reject);
                });
                this.latitude = position.coords.latitude;
                this.longitude = position.coords.longitude;
            } catch (error) {
                if (this.sunrise && this.sunset) {
                    // if we have values for the sunrise & sunset (taken from fallback) 
                    // then still procede with an warning
                    console.warn("Error getting location:", error);
                }
                else {
                    console.error("Error getting location:", error);
                    throw error;
                }

            }
        } else {
            console.log("Geolocation is not supported by this browser.");
        }
    }

    getTimezoneId() {
        // get the user's timezone
        this.timezoneId = Intl.DateTimeFormat().resolvedOptions().timeZone;
    }

    async getSunriseSunset() {

        let url = ""

        if (this.latitude && this.longitude) {
            // if the have values for the latitude & longitude then enable the URL, else try to use the fallback values and if not available do nothing with a warning.
            url = `https://api.sunrise-sunset.org/json?lat=${this.latitude}&lng=${this.longitude}&formatted=0&tzid=${this.timezoneId}`
        }

        try {

            const response = await fetch(url);

            // if the response IS NOT OK
            if (!response.ok) {
                // throw an error with the status code
                throw new Error("Network response was not OK" + response.statusText);
            }

            // if the response IS OK...
            // parse the data
            const data = await response.json()

            this.sunrise = new Date(data.results.civil_twilight_begin)
            this.sunset = new Date(data.results.civil_twilight_end)
            let sunrise = this.sunrise
            let sunset = this.sunset

            // store the values as a fallback on LocalStorage
            setLocalStorage("sunriseSunsetFallback", { sunrise, sunset })

            console.log("values fetched correctly")

            // Now that we have the sunrise & sunset, we can update the currentDate and compare dates
            this.compareDates()

        }
        catch (error) {

            if (this.sunrise && this.sunset) {

                // if we have values for the sunrise & sunset (taken from fallback) 
                // then still procede and compare the dates.
                console.log("used fallback values for sunrise/sunset automatic darkmode")
                this.compareDates();

            } else {
                alert("No fallback available in LocalStorage and was not available to fetch new values.")
            }
        }

    }

    compareDates() {
        // update the currentDateNow to right now's date.
        this.currentDateNow = new Date();

        // compare the dates and change to dark mode as needed
        if (this.currentDateNow > this.sunset) {
            // console.log("DARK MODE >")
            document.body.classList.add("dark-mode");
        }
        else if (this.currentDateNow < this.sunrise) {
            // console.log("DARK MODE <")
            document.body.classList.add("dark-mode");
        }
        else {
            // console.log("LIGHT MODE")
            document.body.classList.remove("dark-mode");
        }
    }

    async init() {
        // execute all of the functions in order

        // try {
        await this.getCoordinates()
        await this.getTimezoneId()
        console.log("fetching the sunrise/sunset times...")
        this.getSunriseSunset()
        // } catch (error) {
        //     alert("Permission must be granted for the automatic dark mode function to work")
        // }


        // once all of the functions have been executed in order
        // set an interval of an hour to refresh the currentDate and 
        // to check if it's time to switch to dark mode
        setInterval(this.compareDates, 3600000);
    }
}