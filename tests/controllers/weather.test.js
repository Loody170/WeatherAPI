const { calculateStatistics, transformCities, } = require('../../controllers/weather');
const { dummyWeatherData } = require('../test_data');

// The tests here test the helper functions in the weather controller
describe('calculateStatistics', () => {
    // The weather data object is a list of weather data for multiple cities
    it('calculates the weather statistics correctly with a given weather data object', () => {
        // The expected statistics for the dummy weather data
        const expectedStatistics = {
            avgTemp: '25 C', maxTemp: '30 C', minTemp: '20 C',
            avgWind: '15 km/h', maxWind: '20 km/h', minWind: '10 km/h',
            avgHumidity: '55 %', maxHumidity: '60 %', minHumidity: '50 %',
            avgCloud: '35 %', maxCloud: '40 %', minCloud: '30 %',
            avgPressure: '1005 mb', maxPressure: '1010 mb', minPressure: '1000 mb',
        };
        const statistics = calculateStatistics(dummyWeatherData);
        // Check that the returned statistics are as expected
        expect(statistics).toEqual(expectedStatistics);
    });

    // The weather data object is empty or undefined
    it('successfuly returns a message that indicates there is no data to calculate incase the weather data object is empty or undefined', () => {
        const statistics = calculateStatistics({ bulk: [] });
        // Check that the returned result is as expected
        expect(statistics).toEqual("No data available to calculate statistics.");
    });
});

describe('transformCities', () => {
    // Test the transformation of the cities array into a list of query objects
    it('transforms the cities array correctly into a list of query objects that is accepted for the getCitiesWeather fetch function', () => {
        const cities = ["Makkah", "Madinah", "Riyadh", "Jeddah"];
        const queryString = transformCities(cities);
        // Check that the returned list object is as expected
        expect(queryString).toEqual([
            { q: "Makkah" },
            { q: "Madinah" },
            { q: "Riyadh" },
            { q: "Jeddah" },
        ]);
    });
});

