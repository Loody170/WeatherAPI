const express = require('express');
const weatherRoutes = require('./routes/weather');

const app = express();
app.use(express.json());

// This is a middleware that will run for all requests to the parent path /weather
app.use("/weather", (req, res, next) => {
    next();
}, weatherRoutes);

// This middleware is responsible for non-existing routes
// It will return a 404 status code and a message
app.use((req, res, next) => {
    const error = new Error('Not found');
    error.statusCode = 404;
    next(error);
});

// This middleware is responsible for handling errors
// Any error that is thrown in the other middlewares will be caught and handled here
app.use((error, req, res, next) => {
    const status = error.statusCode || 500;
    const message = error.message;
    const data = error.data;
    res.status(status).json({ message: message, data: data });
});

// The app object is exported to be used in the server.js file
module.exports = app;

