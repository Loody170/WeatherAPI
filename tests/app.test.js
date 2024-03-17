const request = require('supertest');
const app = require('../app');

// Test the error handler middleware
describe('error handler middleware', () => {
    it('responds with status 404 and error message', async () => {
        // Send a request to a non-existing route and expect a 404 status code
        const response = await request(app)
            .get('/wrong-route')
            .expect(404);
        // Expect the response to have a message property
        expect(response.body.message).toBeDefined();
    });
});
