require('dotenv').config();

const baseUrl = "http://api.weatherapi.com/v1"

exports.fetchCityWeather = async (query) => {
    console.log("fetching weather for city: " + query);
    try {
        const response = await fetch(`${baseUrl}/current.json?key=${process.env.API_KEY}&q=${query}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    }
    catch (err) {
        console.log(err.message);
        return err;
    }
};

exports.fetchCitiesWeather = async (cities) => {
    try {
        const response = await fetch(`${baseUrl}/current.json?key=${process.env.API_KEY}&q=bulk`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "locations": cities,
            }),
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    }

    catch (err) {
        console.log(err.message);
        return err;
    }
}