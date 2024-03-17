// Following the MVC pattern, the routes are handled by functions inside the weatherController
// The functions are called when the route is accessed
const weatherController = require('../controllers/weather');

const express = require('express');

const router = express.Router();

module.exports = router;

// Children routes for the parent route /weather
router.get('/statistics', weatherController.getWeatherStatistics);

router.get('/:city', weatherController.getCityWeather);

router.post('/bulk', weatherController.getCitiesWeather);

