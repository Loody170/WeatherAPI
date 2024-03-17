// require('dotenv').config();

const baseUrl = "http://api.weatherapi.com/v1"

// This function sends a GET request to the 3rd party WeatherAPI to fetch the weather data for a city
exports.fetchCityWeather = async (query) => {
    try {
        // Fetch the weather data for the city
        const response = await fetch(`${baseUrl}/current.json?key=${process.env.API_KEY}&q=${query}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        // Parse the response to JSON
        const data = await response.json();
        // Return the weather data
        return data;
    }
    catch (err) {
        // Log and return the error if an error occurs
        console.log(err);
        return err;
    }
};

// This function sends a POST request to the 3rd party WeatherAPI to fetch the weather data for a list of cities
exports.fetchCitiesWeather = async (cities) => {
    try {
        const response = await fetch(`${baseUrl}/current.json?key=${process.env.API_KEY}&q=bulk`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            // The API requires the list of cities to be in the request body in the format {"locations": [{q: "cityName1"}, {q: "cityName2"}]}
            body: JSON.stringify({
                "locations": cities,
            }),
        });
        // If the response is not OK, throw an error
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        // Parse the response to JSON
        const data = await response.json();
        return data;
    }
    catch (err) {
        // Log and return the error if an error occurs
        console.log(err.message);
        return err;
    }
}