export default class SunriseSunset {
    constructor() {
        this.latitude = 0;
        this.longitude = 0;
        this.timezoneId = "";
        this.sunrise = "";
        this.sunset = "";
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
                console.error("Error getting location:", error);
                throw error;
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
        let url = `https://api.sunrise-sunset.org/json?lat=${this.latitude}&lng=${this.longitude}&formatted=0&tzid=${this.timezoneId}`

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

            // Now that we have the sunrise & sunset, we can update the currentDate and compare dates
            this.compareDates()

        }
        catch (error) {
            console.error("GET Error:", error);
        }
    }

    compareDates() {
        // update the currentDateNow to right now's date.
        this.currentDateNow = new Date();

        // DEBUG ONLY - MANUAL DATE CHANGE FOR TESTING
        // this.currentDateNow.setHours(5)
        // this.currentDateNow.setMinutes(30)
        // this.currentDateNow.setSeconds(0)

        // DEBUG ONLY
        // console.log(this.sunrise)
        // console.log(this.sunset)
        // console.log(this.currentDateNow)

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
        // this.hasPermission
        try {
            await this.getCoordinates()
            await this.getTimezoneId()
            console.log("fetching the sunrise/sunset times...")
            this.getSunriseSunset()
        } catch (error) {
            alert("Permission must be granted for the automatic dark mode function to work")
        }


        // once all of the functions have been executed in order
        // set an interval of an hour to refresh the currentDate and 
        // to check if it's time to switch to dark mode
        setInterval(this.compareDates, 3600000);
    }
}