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

function search(event) {
    if (event) {
        event.preventDefault();
    }
    
    let searchInputElement = document.querySelector("#search-input");
    let city = searchInputElement ? searchInputElement.value.trim() : "Dallas";

    if (city) {
        // Add loading class
        document.querySelector(".weather-app").classList.add("loading");
        
        let apiKey = "df0784t786f3bo13067efba6f53aff47";
        let apiUrl = `https://api.shecodes.io/weather/v1/current?query=${city}&key=${apiKey}&units=metric`;
        
        axios.get(apiUrl)
            .then(response => {
                console.log("Weather data received:", response.data); // Debug log
                displayTemperature(response);
            })
            .catch(error => {
                console.error("Error fetching weather:", error); // Debug log
                handleError(error);
            })
            .finally(() => {
                if (searchInputElement) {
                    searchInputElement.value = ""; // Clear the search input
                }
            });
    }
}

function getGeolocation(event) {
    if (event) {
        event.preventDefault();
    }
    
    // Add loading state
    document.querySelector(".weather-app").classList.add("loading");
    
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
            // Success callback
            function(position) {
                console.log("Location found:", position); // Debug log
                let apiKey = "df0784t786f3bo13067efba6f53aff47";
                let apiUrl = `https://api.shecodes.io/weather/v1/current?lon=${position.coords.longitude}&lat=${position.coords.latitude}&key=${apiKey}&units=metric`;
                
                axios.get(apiUrl)
                    .then(response => {
                        console.log("Weather data received:", response.data); // Debug log
                        displayTemperature(response);
                    })
                    .catch(handleError);
            },
            // Error callback
            function(error) {
                console.error("Geolocation error:", error); // Debug log
                handleGeolocationError(error);
                document.querySelector(".weather-app").classList.remove("loading");
            },
            // Options
            {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0
            }
        );
    } else {
        alert("Geolocation is not supported by your browser");
        document.querySelector(".weather-app").classList.remove("loading");
    }
}

function handleGeolocationError(error) {
    let message;
    switch(error.code) {
        case error.PERMISSION_DENIED:
            message = "Please enable location services to use this feature.";
            break;
        case error.POSITION_UNAVAILABLE:
            message = "Location information is unavailable.";
            break;
        case error.TIMEOUT:
            message = "Location request timed out.";
            break;
        default:
            message = "An unknown error occurred getting your location.";
            break;
    }
    alert(message);
}

// Add this function to handle time-based themes
function updateThemeByTime() {
    const hour = new Date().getHours();
    const root = document.documentElement;
    
    // Early Morning (5-8)
    if (hour >= 5 && hour < 8) {
        root.style.setProperty('--gradient-primary', '#FF7F50');  // Coral
        root.style.setProperty('--gradient-secondary', '#FFA07A'); // Light Salmon
        root.style.setProperty('--box-shadow-color', 'rgba(255, 127, 80, 0.3)');
    }
    // Morning (8-11)
    else if (hour >= 8 && hour < 11) {
        root.style.setProperty('--gradient-primary', '#87CEEB');  // Sky Blue
        root.style.setProperty('--gradient-secondary', '#FFD700'); // Gold
        root.style.setProperty('--box-shadow-color', 'rgba(135, 206, 235, 0.3)');
    }
    // Midday (11-16)
    else if (hour >= 11 && hour < 16) {
        root.style.setProperty('--gradient-primary', '#4169E1');  // Royal Blue
        root.style.setProperty('--gradient-secondary', '#87CEEB'); // Sky Blue
        root.style.setProperty('--box-shadow-color', 'rgba(65, 105, 225, 0.3)');
    }
    // Late Afternoon (16-19)
    else if (hour >= 16 && hour < 19) {
        root.style.setProperty('--gradient-primary', '#FF8C00');  // Dark Orange
        root.style.setProperty('--gradient-secondary', '#FFD700'); // Gold
        root.style.setProperty('--box-shadow-color', 'rgba(255, 140, 0, 0.3)');
    }
    // Evening (19-22)
    else if (hour >= 19 && hour < 22) {
        root.style.setProperty('--gradient-primary', '#4B0082');  // Indigo
        root.style.setProperty('--gradient-secondary', '#FF69B4'); // Hot Pink
        root.style.setProperty('--box-shadow-color', 'rgba(75, 0, 130, 0.3)');
    }
    // Night (22-5)
    else {
        root.style.setProperty('--gradient-primary', '#191970');  // Midnight Blue
        root.style.setProperty('--gradient-secondary', '#483D8B'); // Dark Slate Blue
        root.style.setProperty('--box-shadow-color', 'rgba(25, 25, 112, 0.3)');
    }
}

document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM loaded, setting up event listeners"); // Debug log
    
    // Form submission
    let searchForm = document.querySelector("#search-form");
    if (searchForm) {
        searchForm.addEventListener("submit", (event) => {
            event.preventDefault();
            console.log("Search form submitted"); // Debug log
            search(event);
        });
    }

    // Geolocation button
    let currentLocationButton = document.querySelector("#current-location");
    if (currentLocationButton) {
        currentLocationButton.addEventListener("click", (event) => {
            console.log("Location button clicked"); // Debug log
            getGeolocation(event);
        });
    }

    // Temperature conversion
    let fahrenheitLink = document.querySelector("#fahrenheit-link");
    let celsiusLink = document.querySelector("#celsius-link");
    if (fahrenheitLink && celsiusLink) {
        fahrenheitLink.addEventListener("click", displayFahrenheitTemperature);
        celsiusLink.addEventListener("click", displayCelsiusTemperature);
    }

    // Update time every minute
    setInterval(updateDateTime, 60000);

    // Update theme initially and every minute
    updateThemeByTime();
    setInterval(updateThemeByTime, 60000);

    // Load Dallas weather by default
    console.log("Loading default weather for Dallas"); // Debug log
    search();
});
