const container = document.querySelector('.container'),
  appBody = container.querySelector('.body'),
  cityInput = appBody.querySelector('.select-city input'),
  infoMsg = appBody.querySelector('.select-city .msg'),
  getLocationBtn = appBody.querySelector('.select-city button'),
  backIcon = container.querySelector('.back'),
  weatherImg = appBody.querySelector('.main-details img'),
  temperature = appBody.querySelector('.temp'),
  weatherDesc = appBody.querySelector('.weather-desc'),
  locationCity = appBody.querySelector('.city'),
  Humidity = appBody.querySelector('.number-h'),
  WindSpeed = appBody.querySelector('.number-s');

if (navigator.onLine) {
  cityInput.addEventListener('keyup', e => {
    if (e.key == 'Enter') {
      if (cityInput.value != '') {
        fetchAPI(cityInput.value.trim());
        cityInput.value = '';
      };
    };
  });
} else {
  appBody.classList.add('offline');
};

function fetchAPI(city) {
  infoMsg.classList.add('loading');
  infoMsg.innerHTML = 'Searching For Your City...';
  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=575af8fced42b742db9252da595fe47b`)
    .then(res => res.json()).then(data => {
      if (data.cod != '404') {
        infoMsg.classList.remove('loading', 'error');
        container.classList.add('active');
        showWeather(data);
      } else {
        infoMsg.classList.replace('loading', 'error');
        infoMsg.innerHTML = `${city} Is Not Found`;
      };
    });
};

getLocationBtn.addEventListener('click', () => {
  if (navigator.geolocation) {
    let location = navigator.geolocation;
    location.getCurrentPosition(onSuccess, onError);
  } else {
    infoMsg.classList.add('error');
    infoMsg.innerHTML = 'Your Browser Not Support Geolocation API';
  };

  function onSuccess(pos) {
    let { latitude, longitude } = pos.coords;
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=575af8fced42b742db9252da595fe47b`)
      .then(res => res.json()).then(data => {
        infoMsg.classList.remove('loading', 'error');
        container.classList.add('active');
        showWeather(data);
      });
  };

  function onError(err) {
    infoMsg.classList.add('error');
    infoMsg.innerHTML = err.message;
  };
});

function showWeather(weatherObj) {
  let { humidity, temp } = weatherObj.main,
    windSpeed = weatherObj.wind.speed, { main, description } = weatherObj.weather[0],
    country = weatherObj.sys.country,
    city = weatherObj.name;
  if (main == 'Thunderstorm') {
    weatherImg.src = '/Weather Icons/storm.svg';
  } else if (main == 'Drizzle') {
    weatherImg.src = '/Weather Icons/haze.svg';
  } else if (main == 'Rain') {
    weatherImg.src = '/Weather Icons/rain.svg';
  } else if (main == 'Snow') {
    weatherImg.src = '/Weather Icons/snow.svg';
  } else if (main == 'Atmosphere') {
    weatherImg.src = '/Weather Icons/haze.svg';
  } else if (main == 'Clouds') {
    weatherImg.src = '/Weather Icons/cloud.svg';
  } else {
    weatherImg.src = '/Weather Icons/clear.svg';
  };
  weatherDesc.innerHTML = description;
  temperature.innerHTML = `${temp}°C`;
  locationCity.innerHTML = `<i class="uil uil-location-point"></i> ${city}, ${country}`;
  Humidity.innerHTML = `${humidity}%`;
  WindSpeed.innerHTML = `${windSpeed} KM/H`;
};

backIcon.addEventListener('click', () => {
  container.classList.remove('active');
});