const { getIO } = require('../socket');
const { transformCities } = require('./weather');
const { fetchCitiesWeather } = require('../services/http');

// This function is responsible for setting up the websocket connection and handling the live weather data
// When a client connects to the "live" namespace, the server will start sending live weather data for the cities mentioned in the request
const getLiveWeatherData = async () => {
    const io = getIO();
    let count = 0;
    const liveWeatherEndpoint = io.of('/weather/live');

    liveWeatherEndpoint.on('connection', socket => {
        console.log('New client connected');
        // Keep track of the number of clients connected
        count++;
        console.log("Total clients connected: ", count);
        let intervalId;

        // Keep listening for the "live" event from the client
        socket.on("live", async (citiesList) => {
            // When the "live" event is received, fetch the weather data for the cities mentioned in the request
            const preparedList = transformCities(citiesList);
            const weatherData = await fetchCitiesWeather(preparedList);
            // Filter the weather data to only include the required fields
            const filteredWeatherData = filterWeatherData(weatherData);
            // Send the filtered weather data to the client
            socket.emit("weatherData", filteredWeatherData);

            // Set an interval to keep sending live weather data to the client every 2 minutes
            intervalId = setInterval(async () => {
                const weatherData = await fetchCitiesWeather(preparedList);
                const filteredWeatherData = filterWeatherData(weatherData);
                socket.emit("weatherData", filteredWeatherData);
            }, 1000 * 60 * 2);
        });

        socket.on('disconnect', () => {
            count--;
            // Subtract the count when a client disconnects
            console.log("Total clients connected: ", count);

            // Stop sending live weather data when the client disconnects by clearing the interval
            clearInterval(intervalId);
        });
    });
};

// A helper function to filter the weather data to only include each city's name, coordinates, and temperature in Celsius
const filterWeatherData = (weatherData) => {
    // Map over the weather data and return a new array with the required fields
    return weatherData.bulk.map(city => ({
        name: city.query.location.name,
        coordinates: {
            lat: city.query.location.lat,
            lon: city.query.location.lon
        },
        temperatureC: city.query.current.temp_c
    }));
};

// Export the functions to be used in other files
module.exports = {
    getLiveWeatherData,
    filterWeatherData
};