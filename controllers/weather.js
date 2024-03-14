const redisServer = require('../redis');

const { fetchCityWeather, fetchCitiesWeather } = require('../http');
const allCities = ["Makkah", "Madina", "Riyadh", "Jeddah", "Tayif", "Dammam", "Abha", "Jazan"]

exports.getCityWeather = async (req, res, next) => {
    const city = req.params.city;
    let weatherData;
    try {
        console.log('Getting weather for the city: ' + city);

        const value = await redisServer.getCache(city);
        if (!value) {
            weatherData = await fetchCityWeather(city);
            await redisServer.setCache(city, JSON.stringify(weatherData));
        }
        else {
            weatherData = JSON.parse(value);
        }
        res.status(200).json({
            message: 'Fetched city weather data successfully.',
            data: weatherData,
        });
        console.log("Weather data fethced and sent successfully");
    }
    catch (err) {
        console.error("error: ", err);
        next(err);
    }
}

exports.getCitiesWeather = async (req, res, next) => {
    const { cities } = req.body;
    const preparedList = transformCities(cities);
    try {
        console.log('Getting weather for cities: ' + cities);
        const weatherData = await fetchCitiesWeather(preparedList);
        res.status(200).json({
            message: 'Cities list weather data fetched successfully.',
            data: weatherData,
        });
        console.log("Cities list weather data fetched successfully.");
    }
    catch (err) {
        console.log("error: ", err);
        next(err);
    }
}

exports.getWeatherStatistics = async (req, res) => {
    console.log("Getting weather statistics.");

    const queriesList = transformCities(allCities);
    const weatherData = await fetchCitiesWeather(queriesList);
    const weatherStatistics = calculateStatistics(weatherData);

    // console.log("Printing weather statistics");
    // console.log(weatherStatistics);

    res.status(200).json({
        message: 'Weather statistics fetched successfully.',
        data: weatherStatistics,
    });
    console.log("Weather statistics fethced and sent successfully");
}

function transformCities(cities) {
    return cities.map(city => ({ q: city }));
}

const calculateStatistics = (WeatherData) => {
    let tempSum = 0, tempMax = -Infinity, tempMin = Infinity;
    let windSum = 0, windMax = -Infinity, windMin = Infinity;
    let humiditySum = 0, humidityMax = -Infinity, humidityMin = Infinity;
    let cloudSum = 0, cloudMax = -Infinity, cloudMin = Infinity;
    let pressureSum = 0, pressureMax = -Infinity, pressureMin = Infinity;

    const citiesData = WeatherData.bulk;
    const count = citiesData.length;

    for (let city of citiesData) {
        let cityWeather = city.query.current;

        tempSum += cityWeather.temp_c;
        tempMax = Math.max(tempMax, cityWeather.temp_c);
        tempMin = Math.min(tempMin, cityWeather.temp_c);

        windSum += cityWeather.wind_kph;
        windMax = Math.max(windMax, cityWeather.wind_kph);
        windMin = Math.min(windMin, cityWeather.wind_kph);

        humiditySum += cityWeather.humidity;
        humidityMax = Math.max(humidityMax, cityWeather.humidity);
        humidityMin = Math.min(humidityMin, cityWeather.humidity);

        cloudSum += cityWeather.cloud;
        cloudMax = Math.max(cloudMax, cityWeather.cloud);
        cloudMin = Math.min(cloudMin, cityWeather.cloud);

        pressureSum += cityWeather.pressure_mb;
        pressureMax = Math.max(pressureMax, cityWeather.pressure_mb);
        pressureMin = Math.min(pressureMin, cityWeather.pressure_mb);
    }

    return {
        avgTemp: tempSum / count + " C",
        maxTemp: tempMax + " C",
        minTemp: tempMin + " C",

        avgWind: windSum / count + " km/h",
        maxWind: windMax + " km/h",
        minWind: windMin + " km/h",

        avgHumidity: humiditySum / count + " %",
        maxHumidity: humidityMax + " %",
        minHumidity: humidityMin + " %",

        avgCloud: cloudSum / count + " %",
        maxCloud: cloudMax + " %",
        minCloud: cloudMin + " %",

        avgPressure: pressureSum / count + " mb",
        maxPressure: pressureMax + " mb",
        minPressure: pressureMin + " mb",
    };
};
