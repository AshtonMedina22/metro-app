// Global variables for temperature conversion
let celsiusTemperature = null;

function getCurrentDateTime() {
    return new Date();
}

function updateDateTime() {
    let dateElement = document.querySelector("#current-date");
    dateElement.innerHTML = formatDate(getCurrentDateTime());
}

function displayTemperature(response) {
    celsiusTemperature = response.data.temperature.current;
    
    let temperatureElement = document.querySelector("#temperature");
    let cityElement = document.querySelector("#current-city");
    let descriptionElement = document.querySelector("#weather-description");
    let humidityElement = document.querySelector("#humidity");
    let windElement = document.querySelector("#wind-speed");
    let iconElement = document.querySelector("#weather-icon");
    let dateElement = document.querySelector("#current-date");

    // Remove loading class
    document.querySelector(".weather-app").classList.remove("loading");

    // Update all elements with fade effect
    fadeOut([cityElement, temperatureElement, descriptionElement, dateElement]);
    
    setTimeout(() => {
        cityElement.innerHTML = response.data.city;
        temperatureElement.innerHTML = Math.round(celsiusTemperature);
        descriptionElement.innerHTML = response.data.condition.description;
        humidityElement.innerHTML = `${response.data.temperature.humidity}%`;
        windElement.innerHTML = `${Math.round(response.data.wind.speed)}km/h`;
        dateElement.innerHTML = formatDate(getCurrentDateTime());
        
        iconElement.src = response.data.condition.icon_url;
        iconElement.alt = response.data.condition.description;

        fadeIn([cityElement, temperatureElement, descriptionElement, dateElement]);
        
        // Create weather animation
        createWeatherAnimation(response.data.condition.description);

        // Get forecast
        getForecast(response.data.city);
    }, 300);
}

function displayForecast(response) {
    let forecastElement = document.querySelector("#forecast");
    let forecastHTML = '<div class="forecast-container">';
    
    response.data.daily.slice(0, 5).forEach((day, index) => {
        forecastHTML += `
            <div class="forecast-day">
                <div class="forecast-date">${formatDay(index)}</div>
                <img src="${day.condition.icon_url}" alt="${day.condition.description}" class="forecast-icon">
                <div class="forecast-temperatures">
                    <span class="forecast-temp-max" data-celsius="${Math.round(day.temperature.maximum)}">${Math.round(day.temperature.maximum)}°</span>
                    <span class="forecast-temp-min" data-celsius="${Math.round(day.temperature.minimum)}">${Math.round(day.temperature.minimum)}°</span>
                </div>
            </div>
        `;
    });

    forecastHTML += '</div>';
    forecastElement.innerHTML = forecastHTML;
}

function formatDay(dayIndex) {
    let date = new Date();
    date.setDate(date.getDate() + dayIndex + 1);
    let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return days[date.getDay()];
}

function search(event) {
    if (event) {
        event.preventDefault();
    }
    
    let searchInputElement = document.querySelector("#search-input");
    let city = searchInputElement ? searchInputElement.value.trim() : "Dallas";

    // Add loading class
    document.querySelector(".weather-app").classList.add("loading");
    
    let apiKey = "df0784t786f3bo13067efba6f53aff47";
    let apiUrl = `https://api.shecodes.io/weather/v1/current?query=${city}&key=${apiKey}&units=metric`;
    
    axios.get(apiUrl)
        .then(displayTemperature)
        .catch(handleError)
        .finally(() => {
            if (searchInputElement) {
                searchInputElement.value = ""; // Clear the search input
            }
        });
}

function handleError(error) {
    document.querySelector(".weather-app").classList.remove("loading");
    alert("Please enter a valid city name");
}

function getForecast(city) {
    let apiKey = "df0784t786f3bo13067efba6f53aff47";
    let apiUrl = `https://api.shecodes.io/weather/v1/forecast?query=${city}&key=${apiKey}&units=metric`;
    axios.get(apiUrl).then(displayForecast);
}

function getGeolocation(event) {
    event.preventDefault();
    navigator.geolocation.getCurrentPosition(showPosition, handleGeolocationError);
}

function showPosition(position) {
    let apiKey = "df0784t786f3bo13067efba6f53aff47";
    let apiUrl = `https://api.shecodes.io/weather/v1/current?lon=${position.coords.longitude}&lat=${position.coords.latitude}&key=${apiKey}&units=metric`;
    axios.get(apiUrl).then(displayTemperature);
}

function handleGeolocationError() {
    alert("Unable to get your location. Please enable location services.");
}

function displayFahrenheitTemperature(event) {
    event.preventDefault();
    let temperatureElement = document.querySelector("#temperature");
    let fahrenheitLink = document.querySelector("#fahrenheit-link");
    let celsiusLink = document.querySelector("#celsius-link");
    
    // Add animation class
    temperatureElement.style.opacity = "0";
    
    setTimeout(() => {
        celsiusLink.classList.remove("active");
        fahrenheitLink.classList.add("active");
        
        let fahrenheitTemperature = (celsiusTemperature * 9) / 5 + 32;
        temperatureElement.innerHTML = Math.round(fahrenheitTemperature);
        
        // Update forecast temperatures if they exist
        updateForecastTemperatures('F');
        
        temperatureElement.style.opacity = "1";
    }, 300);
}

function displayCelsiusTemperature(event) {
    event.preventDefault();
    let temperatureElement = document.querySelector("#temperature");
    let fahrenheitLink = document.querySelector("#fahrenheit-link");
    let celsiusLink = document.querySelector("#celsius-link");
    
    // Add animation class
    temperatureElement.style.opacity = "0";
    
    setTimeout(() => {
        fahrenheitLink.classList.remove("active");
        celsiusLink.classList.add("active");
        
        temperatureElement.innerHTML = Math.round(celsiusTemperature);
        
        // Update forecast temperatures if they exist
        updateForecastTemperatures('C');
        
        temperatureElement.style.opacity = "1";
    }, 300);
}

// Add this new function to handle forecast temperature updates
function updateForecastTemperatures(unit) {
    let forecastMaxTemps = document.querySelectorAll(".forecast-temp-max");
    let forecastMinTemps = document.querySelectorAll(".forecast-temp-min");
    
    forecastMaxTemps.forEach(temp => {
        let currentTemp = parseInt(temp.textContent);
        if (unit === 'F' && temp.dataset.celsius) {
            temp.textContent = `${Math.round((currentTemp * 9/5) + 32)}°`;
        } else if (unit === 'C' && temp.dataset.celsius) {
            temp.textContent = `${temp.dataset.celsius}°`;
        }
    });
    
    forecastMinTemps.forEach(temp => {
        let currentTemp = parseInt(temp.textContent);
        if (unit === 'F' && temp.dataset.celsius) {
            temp.textContent = `${Math.round((currentTemp * 9/5) + 32)}°`;
        } else if (unit === 'C' && temp.dataset.celsius) {
            temp.textContent = `${temp.dataset.celsius}°`;
        }
    });
}

function formatDate(date) {
    let minutes = date.getMinutes();
    let hours = date.getHours();
    let day = date.getDay();
    let month = date.getMonth();
    let dateNum = date.getDate();

    if (minutes < 10) {
        minutes = `0${minutes}`;
    }

    if (hours < 10) {
        hours = `0${hours}`;
    }

    let days = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
    ];

    let months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
    ];

    let formattedDay = days[day];
    let formattedMonth = months[month];
    return `${formattedDay}, ${formattedMonth} ${dateNum} | ${hours}:${minutes}`;
}

// Add this function to create weather animations
function createWeatherAnimation(condition) {
    const weatherContainer = document.querySelector('.weather-app');
    
    // Remove existing animation
    const existingAnimation = weatherContainer.querySelector('.weather-animation');
    if (existingAnimation) {
        existingAnimation.remove();
    }

    const animationContainer = document.createElement('div');
    animationContainer.className = 'weather-animation';

    switch (condition.toLowerCase()) {
        case 'rain':
        case 'shower rain':
        case 'moderate rain':
            for (let i = 0; i < 20; i++) {
                const drop = document.createElement('div');
                drop.className = 'rain-drop';
                drop.style.left = `${Math.random() * 100}%`;
                drop.style.animationDelay = `${Math.random() * 2}s`;
                animationContainer.appendChild(drop);
            }
            break;

        case 'snow':
            for (let i = 0; i < 30; i++) {
                const snowflake = document.createElement('div');
                snowflake.className = 'snowflake';
                snowflake.style.left = `${Math.random() * 100}%`;
                snowflake.style.animationDelay = `${Math.random() * 3}s`;
                snowflake.style.opacity = Math.random() * 0.7 + 0.3;
                animationContainer.appendChild(snowflake);
            }
            break;

        case 'clouds':
        case 'few clouds':
        case 'scattered clouds':
        case 'broken clouds':
            for (let i = 0; i < 5; i++) {
                const cloud = document.createElement('div');
                cloud.className = 'cloud';
                cloud.style.left = `${Math.random() * 80}%`;
                cloud.style.top = `${Math.random() * 50}%`;
                cloud.style.width = `${Math.random() * 100 + 50}px`;
                cloud.style.height = `${Math.random() * 30 + 20}px`;
                cloud.style.animationDelay = `${Math.random() * 2}s`;
                animationContainer.appendChild(cloud);
            }
            break;

        case 'clear sky':
            const sun = document.createElement('div');
            sun.className = 'sun';
            sun.style.top = '20%';
            sun.style.right = '20%';
            animationContainer.appendChild(sun);
            break;

        case 'thunderstorm':
            const thunder = document.createElement('div');
            thunder.className = 'thunder';
            animationContainer.appendChild(thunder);
            // Add rain as well
            for (let i = 0; i < 20; i++) {
                const drop = document.createElement('div');
                drop.className = 'rain-drop';
                drop.style.left = `${Math.random() * 100}%`;
                drop.style.animationDelay = `${Math.random() * 2}s`;
                animationContainer.appendChild(drop);
            }
            break;

        case 'mist':
        case 'fog':
            const mist = document.createElement('div');
            mist.className = 'mist';
            animationContainer.appendChild(mist);
            break;
    }

    weatherContainer.appendChild(animationContainer);
}

// Add these helper functions for smooth transitions
function fadeOut(elements) {
    elements.forEach(element => {
        element.style.opacity = '0';
        element.style.transition = 'opacity 0.3s ease-out';
    });
}

function fadeIn(elements) {
    elements.forEach(element => {
        element.style.opacity = '1';
        element.style.transition = 'opacity 0.3s ease-in';
    });
}

// Set up event listeners
document.addEventListener("DOMContentLoaded", () => {
    // Set up form submission
    let searchForm = document.querySelector("#search-form");
    searchForm.addEventListener("submit", search);

    // Temperature conversion
    let fahrenheitLink = document.querySelector("#fahrenheit-link");
    let celsiusLink = document.querySelector("#celsius-link");
    fahrenheitLink.addEventListener("click", displayFahrenheitTemperature);
    celsiusLink.addEventListener("click", displayCelsiusTemperature);

    // Geolocation
    let currentLocationButton = document.querySelector("#current-location");
    currentLocationButton.addEventListener("click", getGeolocation);

    // Update time every minute
    setInterval(updateDateTime, 60000);

    // Load Dallas weather by default
    search();
}); 