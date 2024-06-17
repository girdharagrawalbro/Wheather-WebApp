    document.addEventListener('DOMContentLoaded', function () {
        const weekdata = document.getElementById('data');
        const todaydata = document.getElementById('today');
        const searchForm = document.getElementById('searchForm');
        const searchInput = document.getElementById('searchInput');

        searchForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const location = searchInput.value.trim();
            if (location) {
                localStorage.setItem('location', location);
                fetchWeather(location);
            }
        });

        function fetchWeather(location) {
            const url = `https://data.api.xweather.com/forecasts/${location}?format=json&filter=day&limit=7&client_id=BcUwkZ5dtgM1RfjLnPTF5&client_secret=p0UhpKc3OSJyarJf3xnqUF0zHQIJE9JyFddJmFUP`;

            fetch(url)
                .then(response => response.json())
                .then(json => {
                    if (!json.success) {
                        // console.log('Data not found');
                        todaydata.innerHTML += "<h5>No Data Found</h5>";

                    } else {
                        console.log(json);
                        weekdata.innerHTML = '';
                        todaydata.innerHTML = '';
                        json.response.forEach(item => {
                            const place = item.place;
                            const periods = item.periods;
                            const today = periods[0];

                            const placeName = place.name;
                            const country = place.country;

                            const dateTimeISO = today.dateTimeISO;
                            const avgTempC = today.avgTempC;
                            const avgTempF = today.avgTempF;
                            const maxTempC = today.maxTempC;
                            const minTempC = today.minTempC;
                            const windSpeedKPH = today.windSpeedKPH;
                            const humidity = today.humidity;
                            const weather = today.weather;
                            const weatherPrimary = today.weatherPrimary;
                            const icon = today.icon;

                            const headHTML = `
                                <div>

                                    <h3 style="text-transform: capitalize;">
                                        ${placeName}, <span style="text-transform: uppercase;">${country}</span>
                                    </h3>
                                    <p>Updated a few minutes ago</p>
                                </div>
                                <div class="d-flex justify-content-around">
                                    <div>
                                        <img src="png/${icon}" alt="img" style="width:100px">
                                    </div>
                                    <div class="d-flex align-items-center">
                                        <h1 style="font-size: xxx-large;">${avgTempC} &deg;C</h1>
                                    </div>
                                    <div class="text-muted">
                                        <div>
                                            <h5>${avgTempC} &deg;C</h5>
                                        </div>
                                        <hr>
                                        <div>
                                            <h5>${avgTempF} F</h5>
                                        </div>
                                    </div>
                                    <div>
                                        <div><h5>${maxTempC} &deg;C</h5></div>
                                        <hr>
                                        <div><h5>${minTempC} &deg;C</h5></div>
                                    </div>
                                    <div>
                                        <h6>Wind: ${windSpeedKPH} KMPH</h6>
                                        <h6>Humidity: ${humidity}%</h6>
                                    </div>
                                </div>
                                <div class="my-2">
                                    <h5>${weather} &middot; ${new Date(dateTimeISO).toLocaleDateString(undefined, { weekday: 'short' })} ${new Date().toLocaleDateString(undefined, { day: 'numeric' })}, ${new Date().toLocaleTimeString([], { hour: 'numeric', minute: 'numeric' })}</h5>
                                </div>
                            `;

                            todaydata.innerHTML += headHTML;
                            periods.forEach(period => {
                                const dateTimeISO = period.dateTimeISO;
                                const maxTempC = period.maxTempC;
                                const minTempC = period.minTempC;

                                const weatherPrimary = period.weatherPrimary;
                                const icon = period.icon;

                                const cardHTML = `
                                    <div class="card text-center p-2" style="width: 18rem;">
                                        <h5>${new Date(dateTimeISO).toLocaleDateString(undefined, { weekday: 'short' })} ${new Date().toLocaleDateString(undefined, { day: 'numeric' })}</h5>
                                        <img src="png/${icon}" class="card-img-top" alt="${icon}">
                                        <div class="card-body">
                                            <p class="card-text">${weatherPrimary}</p>
                                            <p class="card-text"> ${maxTempC}°C</p>
                                            <p class="card-text">${minTempC}°C</p>
                                        </div>
                                    </div>`;
                                weekdata.innerHTML += cardHTML;
                            });

                        });
                    }
                })
                .catch(error => {
                    console.log('Error:', error);
                });
        }

        // Fetch weather data from local storage or default location on page load
        const storedLocation = localStorage.getItem('location');
        if (storedLocation) {
            searchInput.value = storedLocation;
            fetchWeather(storedLocation);
        } else {
            fetchWeather(':auto');
        }
    });
