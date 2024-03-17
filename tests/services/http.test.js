const nock = require('nock');
const { fetchCityWeather } = require('../../services/http');
const { apiResponse } = require('../test_data');

// Test the fetch function to the 3rd party WeatherAPI
// This test uses the nock library to mock the API response
describe('fetchCityWeather', () => {
    it('fetches weather data for a given city name', async () => {
        // Mock the API response data
        const mockData = apiResponse;
        // Mock the API call using nock
        nock('http://api.weatherapi.com')
            .get('/v1/current.json')
            .query({ key: process.env.API_KEY, q: "Jeddah" })
            .reply(200, mockData);

        // Call the function
        const data = await fetchCityWeather('Jeddah');

        // The response is a complex object that has changing data that can result the test to fail such as the tempature
        // So we only check the present of some unchanging data and ensure the response have the same structure as the mock data
        expect(data).toMatchObject({
            location: expect.objectContaining({
                country: mockData.location.country,
                lat: mockData.location.lat,
                lon: mockData.location.lon,
                name: mockData.location.name,
                region: mockData.location.region,
            }),
        });
    });
});