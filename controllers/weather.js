const redisServer = require('../services/redis');
const { fetchCityWeather, fetchCitiesWeather } = require('../services/http');
// A constant that holds the list of all cities mentioned in the assignment
const { ALL_CITIES } = require('../util/data');

// A controller function that fetches weather data for a single city
const getCityWeather = async (req, res, next) => {
    // Get the city name from the request parameters
    const city = req.params.city;
    let weatherData;
    try {
        console.log('Getting weather for the city: ' + city);
        // Check if the weather data for the city is already cached
        const value = await redisServer.getCache(city);
        if (!value) {
            // If the weather data is not cached, fetch it from the 3rd party API and cache it
            weatherData = await fetchCityWeather(city);
            await redisServer.setCache(city, JSON.stringify(weatherData));
        }
        else {
            // If the weather data is cached, parse it to JSON to be sent
            weatherData = JSON.parse(value);
        }
        // Send the weather data as a response
        res.status(200).json({
            message: 'Fetched city weather data successfully.',
            data: weatherData,
        });
    }
    catch (err) {
        // If an error occurs, log it and pass it to the error handling middleware
        console.error("error: ", err);
        next(err);
    }
}

// A controller function that fetches weather data for a list of cities
const getCitiesWeather = async (req, res, next) => {
    // Get the list of cities from the POST request body
    const { cities } = req.body;
    // The 3rd party WeatherAPI requires cities names to be in a list of objects in the format {q: "cityName"}
    // This helper function transforms the list of city names to the required format
    const preparedList = transformCities(cities);

    try {
        // Fetch the weather data for the list of cities after transforming it
        const weatherData = await fetchCitiesWeather(preparedList);
        // Send the weather data as a response
        res.status(200).json({
            message: 'Cities list weather data fetched successfully.',
            data: weatherData,
        });
    }
    catch (err) {
        // If an error occurs, log it and pass it to the error handling middleware
        console.log("error: ", err);
        next(err);
    }
}

// A controller function that fetches weather statistics for all cities 
const getWeatherStatistics = async (req, res) => {
    // Transform the list of cities to the required format
    const queriesList = transformCities(ALL_CITIES);
    // Fetch the weather data for all cities
    const weatherData = await fetchCitiesWeather(queriesList);

    // Use a helper function to calculate the statistics and return them
    const weatherStatistics = calculateStatistics(weatherData);

    // Send the statistics as a response
    res.status(200).json({
        message: 'Weather statistics fetched successfully.',
        data: weatherStatistics,
    });
    console.log("Weather statistics fethced and sent successfully");
}

// A helper function that transforms a list of city names to the required format for WeatherAPI
const transformCities = (cities) => {
    return cities.map(city => ({ q: city }));
}

// A helper function that calculates the weather statistics for a list of cities
const calculateStatistics = (WeatherData) => {
    // If the weather data is empty, exit the function and return a message
    if (!WeatherData.bulk || WeatherData.bulk.length === 0) {
        return 'No data available to calculate statistics.';
    }

    // For the statistics, I focused on the following weather parameters: temperature, wind, humidity, cloud coverage, and pressure
    // For each parameter, I calculated the average, maximum, and minimum values

    // Initialize the sums and the maximum and minimum values for each parameter
    // infinity is used to ensure that the first value is always greater than the initial maximum and the same for the -infinity and the minimum
    let tempSum = 0, tempMax = -Infinity, tempMin = Infinity;
    let windSum = 0, windMax = -Infinity, windMin = Infinity;
    let humiditySum = 0, humidityMax = -Infinity, humidityMin = Infinity;
    let cloudSum = 0, cloudMax = -Infinity, cloudMin = Infinity;
    let pressureSum = 0, pressureMax = -Infinity, pressureMin = Infinity;

    // Access the weather data
    const citiesData = WeatherData.bulk;
    const count = citiesData.length;

    // Iterate over each city and calculate the sum and the maximum and minimum values for each parameter
    for (let city of citiesData) {
        let cityWeather = city.query.current;

        /* To avoid the repetition of the code, I used a helper function
           to calculate the aggregate values for each weather parameter. The helper
           function returns an object that contains the sum, the maximum,
           and the minimum values for the specified weather parameter. I used object destructuring
           to assign the returned values to the variables 
        */
        ({ sum: tempSum, max: tempMax, min: tempMin } =
            calculateWeatherParameter(cityWeather.temp_c, tempSum, tempMax, tempMin));

        ({ sum: windSum, max: windMax, min: windMin } =
            calculateWeatherParameter(cityWeather.wind_kph, windSum, windMax, windMin));

        ({ sum: humiditySum, max: humidityMax, min: humidityMin } =
            calculateWeatherParameter(cityWeather.humidity, humiditySum, humidityMax, humidityMin));

        ({ sum: cloudSum, max: cloudMax, min: cloudMin } =
            calculateWeatherParameter(cityWeather.cloud, cloudSum, cloudMax, cloudMin));

        ({ sum: pressureSum, max: pressureMax, min: pressureMin } =
            calculateWeatherParameter(cityWeather.pressure_mb, pressureSum, pressureMax, pressureMin));

        /* Incase if this was hard to read, this is essentially
           the same as doing for example the bellow code to calculate
           the sum and max and min for the temerature:

           tempSum += cityWeather.temp_c;
           tempMax = Math.max(tempMax, cityWeather.temp_c);
           tempMin = Math.min(tempMin, cityWeather.temp_c); 

           So instead for repeating those three lines for each weather parameter,
           I used the helper function as above to make the code more DRY (Don't Repeat Yourself principle)
        */
    }
    // Calculate the averages and return the statistics
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

const calculateWeatherParameter = (value, sum, max, min) => {
    return {
        sum: sum + value,
        max: Math.max(max, value),
        min: Math.min(min, value),
    }
};

// Export the controller functions to be used in the routes and other files such as test tests
module.exports = {
    getCityWeather,
    getCitiesWeather,
    getWeatherStatistics,
    transformCities,
    calculateStatistics,
}
