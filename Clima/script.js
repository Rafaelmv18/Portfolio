const apiKey = "";

const cityInput = document.querySelector('#city_name');
const search = document.querySelector('#search');
const weatherContainer = document.querySelector('#weather');

const cityElement = document.querySelector("#city");
const tempElement = document.querySelector("#temperature span");
const tempMaxElement = document.querySelector("#tempMax span");
const tempMinElement = document.querySelector("#tempMin span");
const descElement = document.querySelector("#description");
const weatherIconElement = document.querySelector("#temp_img");
const humidityElement = document.querySelector("#umidity span");
const windElement = document.querySelector("#wind span");

function updateBackgroundColor(description, sunrise, sunset) {
    const body = document.querySelector(".weather-info");
    const now = Date.now() / 1000;

    const isDaytime = now >= sunrise && now <= sunset;

    let bgColor = "";

    if (description.includes("céu limpo")) {
        bgColor = isDaytime ? "#87ceeb" : "#0d1b2a";
    } else if (description.includes("nublado")) {
        bgColor = isDaytime ? "#b0bec5" : "#455a64";
    } else if (description.includes("nuvens dispersas")) {
        bgColor = isDaytime ? "#a2b9c6" : "#37474f";
    } else if (description.includes("nuvens quebradas")) {
        bgColor = isDaytime ? "#90a4ae" : "#263238";
    } else if (description.includes("chuva")) {
        bgColor = isDaytime ? "#607d8b" : "#1c2b36";
    } else if (description.includes("trovoada")) {
        bgColor = isDaytime ? "#37474f" : "#121b22";
    } else if (description.includes("neve")) {
        bgColor = isDaytime ? "#e0f7fa" : "#90a4ae";
    } else if (description.includes("névoa") || description.includes("neblina")) {
        bgColor = isDaytime ? "#cfd8dc" : "#455a64";
    } else {
        bgColor = isDaytime ? "#5c6bc0" : "#1b263b";
    }

    body.style.backgroundColor = bgColor;
}


const getWeatherData = async (city) => {
    const apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}&lang=pt_br`;

    try {
        const res = await fetch(apiURL);


        const data = await res.json();
        return data;
    } catch (error) {
        alert(error.message);
        return null;
    }
};

const showWeatherData = async (city) => {
    const data = await getWeatherData(city);
    if (!data) return;

    cityElement.innerText = `${data.name}, ${data.sys.country}`;
    tempElement.innerText = `${parseInt(data.main.temp)}°C`;
    tempMaxElement.innerText = `${parseInt(data.main.temp_max)}°C`;
    tempMinElement.innerText = `${parseInt(data.main.temp_min)}°C`;
    descElement.innerText = data.weather[0].description;
    humidityElement.innerText = `${data.main.humidity}%`;
    windElement.innerText = `${data.wind.speed} Km/h`;
    weatherIconElement.setAttribute("src", `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`);

    expandWeatherSection();
    
    updateBackgroundColor(
        data.weather[0].description,
        data.sys.sunrise,
        data.sys.sunset
    );

};

function expandWeatherSection() {
    weatherContainer.classList.add("visible");

    weatherContainer.style.height = "auto";
    const scrollHeight = weatherContainer.scrollHeight + "px";

    weatherContainer.style.height = "0px";
    requestAnimationFrame(() => {
        weatherContainer.style.height = scrollHeight;
    });

    weatherContainer.addEventListener("transitionend", () => {
        weatherContainer.style.height = "auto";
    }, { once: true });
}

search.addEventListener("click", (e) => {
    e.preventDefault();
    const city = cityInput.value.trim();
    if (city !== "") {
        showWeatherData(city);
    }
});

cityInput.addEventListener("keyup", (e) => {
    if (e.code === "Enter") {
        const city = e.target.value.trim();
        if (city !== "") {
            showWeatherData(city);
        }
    }
});
