async function getWeather() {
  const apikey = "4e07583cffaa5fcdf47f57d9d7cf7b93";
  const city = document.getElementById("city").value;

  if (!city) {
    alert("Please enter a city");
    return;
  }
  //    weather url
  const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apikey}`;
  try {
    const response = await fetch(currentWeatherUrl);
    const data = await response.json();
    displayWeather(data);
  } catch (error) {
    console.error("Error fetching current weather data:", error);
    alert("Error fetching current weather data. Please try again.");
  }

  //  forecast url
  const weatherForecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apikey}`;
  try {
    const response = await fetch(weatherForecastUrl);
    const data = await response.json();
    displayHourlyForecast(data.list);
  } catch (error) {
    console.error("Error fetching hourly forecast data:", error);
    alert("Error fetching hourly forecast data. Please try again.");
  }
}

// displaying the data

function displayWeather(data) {
  const tempDivInfo = document.getElementById("temp-div");
  const weatherInfoDiv = document.getElementById("weather-info");
  const weatherIcon = document.getElementById("weather-icon");
  const hourlyForcastDiv = document.getElementById("hourly-forcast");
  weatherInfoDiv.style.display = "block";
  // Clear previous content
  weatherInfoDiv.innerHTM = "";
  hourlyForcastDiv.innerHTML = "";
  tempDivInfo.innerHTML = "";

  if (data.cod === "404") {
    weatherInfoDiv.innerHTML = `<p>${data.message}</p>`;
  } else {
    const cityName = data.name;
    const temperature = Math.round(data.main.temp - 273.15);
    const description = data.weather[0].description;
    const iconCode = data.weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;

    const temperatureHtml = `<p>${temperature}°C</p>`;
    const weatherHtml = `
     <p>${cityName}</p>
     <p>${description}</p>
    `;
    tempDivInfo.innerHTML = temperatureHtml;
    weatherInfoDiv.innerHTML = weatherHtml;
    weatherIcon.src = iconUrl;
    weatherIcon.alt = description;
    showImage();
  }
}

function displayHourlyForecast(data) {
  const hourlyForcastDiv = document.getElementById("hourly-forcast");

  // Clear any existing content (optional)
  hourlyForcastDiv.innerHTML = "";

  const next24Hours = data.slice(0, 4); // Display the next 24 hours (3-hour intervals is by default api)

  next24Hours.map((item) => {
    const dateTime = new Date(item.dt * 1000); // Convert timestamp to milliseconds
    const hour = dateTime.getHours() % 12; // Get hour in 12-hour format (0-11)
    const isAm = dateTime.getHours() < 12; // Check for AM/PM
    const time = isAm ? `${hour}:00 AM` : `${hour}:00 PM`;
    const temperature = Math.round(item.main.temp - 273.15); // Convert to Celsius
    const iconCode = item.weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`;

    const hourlyItemHtml = `
      <div class="hourly-item">
        <span>${time}</span>
        <img src="${iconUrl}" alt="Hourly Weather Icon">
        <span>${temperature}°C</span>
      </div>
    `;

    hourlyForcastDiv.innerHTML += hourlyItemHtml;
  });
}

function showImage() {
  const weatherIcon = document.getElementById("weather-icon");
  weatherIcon.style.display = "block";
}
