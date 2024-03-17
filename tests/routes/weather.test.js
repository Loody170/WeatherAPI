const redisServer = require("../../services/redis");
// Use superset library to test the routes
const request = require('supertest');
const app = require('../../app');

// Mock the redis service to avoid connecting to the actual redis server
jest.mock('../../services/redis', () => ({
    getCache: jest.fn(),
    setCache: jest.fn(),
}));


describe('Weather Routes', () => {
    // Test the GET /weather/:city route with the scenario of a cache miss
    it('GET /weather/:city - succesful request with a cache miss', async () => {
        // Mock the redis service to return null for the cache value
        redisServer.getCache.mockResolvedValue(null);
        redisServer.setCache.mockResolvedValue(undefined);
        const city = 'Jeddah';
        // Send a request to the route and expect a 200 status code
        await request(app)
            .get(`/weather/${city}`)
            .expect(200);
    });

    // Test the GET /weather/:city route with the scenario of a cache hit
    it('GET /weather/:city - succesful request with a cache hit', async () => {
        // Make some dummy weather data to be returned from the cache
        const mockWeatherData = { temperature: 30, humidity: 75 };
        redisServer.getCache.mockResolvedValue(JSON.stringify(mockWeatherData));

        const city = 'Jeddah';
        // Send a request to the route and expect a 200 status code and the correct data
        const response = await request(app)
            .get(`/weather/${city}`)
            .expect(200);
        expect(response.body).toEqual({
            message: 'Fetched city weather data successfully.',
            data: mockWeatherData,
        });
    });

    // Test the GET /weather/statistics endpoint
    it('GET /weather/statistics', async () => {
        // Send a request to the route and expect a 200 status code
        await request(app)
            .get('/weather/statistics')
            .expect(200);
    });

    // Test the POST /weather/bulk endpoint
    it('POST /weather/bulk - succesful request', async () => {
        // Send a request to the route with a list of cities and expect a 200 status code
        const cities = ["Tayif", "Dammam", "Riyadh", "Abha"];
        const response = await request(app)
            .post('/weather/bulk')
            .send({ cities })
            .expect(200);
    });
});