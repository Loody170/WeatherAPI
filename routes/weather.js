const weatherController = require('../controllers/weather');

const express = require('express');

const router = express.Router();

module.exports = router;

router.get('/statistics', weatherController.getWeatherStatistics);

router.get('/:city', weatherController.getCityWeather);

router.post('/bulk', weatherController.getCitiesWeather);

