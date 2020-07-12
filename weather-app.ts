const notificationElement = document.querySelector(".notification");
const iconElement = document.querySelector(".weather-icon");
const temperatureElement = document.querySelector(".temperature p");
const descriptionElement = document.querySelector(".weather-description p");
const windElement = document.querySelector(".wind p");
// dummy weather variable until the real one is filled
var weather = {
    temperature: {
        value: 0,
        unit: 'celsius'
    },
    description: 'sunny',
    iconID: '01d',
    wind: 'Boston',
};
const key = "5571976de9msh1b25761cac784aep1a7dbdjsnf6c9d341be93";

// will first check to see if the current browser supports geolocation
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(setPosition, showError);
}
else {
    notificationElement.innerHTML = "<p>Not able to determine location</p>";
}

//function to set the latitude and longitude of user
function setPosition(position) {
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;

    getWeather(latitude, longitude);
}

//function to display an error if one occurs
function showError(error) {
    notificationElement.innerHTML = `<p> ${error.message} </p>`;
}

//function that gets the weather for a given latitude and longitude and stores it in the weather object
function getWeather(latitude, longitude) {
    fetch(`https://dark-sky.p.rapidapi.com/${latitude},${longitude}?lang=en&units=si`, {
        "method": "GET",
        "headers": {
            "x-rapidapi-host": "dark-sky.p.rapidapi.com",
            "x-rapidapi-key": key
        }
    })
        .then(function (response) {
            let data = response.json();
            return data;
        })
        .then(function (data) {
            weather.temperature.value = Math.floor(data.currently.temperature);
            weather.description = data.currently.summary;
            weather.iconID = data.currently.icon;
            weather.wind = data.currently.windSpeed;
        })
        .then(function () {
            displayWeather();
        })
}

//function to display the weather that is stored in the weather object
function displayWeather() {
    console.log(weather.description);
    iconElement.innerHTML = `<img src="./imgs/${weather.iconID}.png" class="img-icon"/>`;
    temperatureElement.innerHTML = `${weather.temperature.value}° <span>C</span>`;
    descriptionElement.innerHTML = weather.description;
    windElement.innerHTML = `Wind Speed: ${weather.wind} m/s`;
}

function celsiusToFahrenheit(temperature) {
    return (temperature * 9 / 5) + 32;
}

//when the user clicks on the temperature it will change from fahrenheit to celsius
temperatureElement.addEventListener("click", function () {
    if (weather.temperature.value === undefined) {
        return;
    }
    if (weather.temperature.unit === 'celsius') {
        var fahrenheit = celsiusToFahrenheit(weather.temperature.value);
        fahrenheit = Math.floor(fahrenheit);
        temperatureElement.innerHTML = `${fahrenheit}° <span>F</span>`;
        weather.temperature.unit = 'fahrenheit';
    }
    else {
        temperatureElement.innerHTML = `${weather.temperature.value}° <span>C</span>`;
        weather.temperature.unit = 'celsius';
    }
});