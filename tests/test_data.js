// This file contains the test data for the tests in the tests folder

const apiResponse =
{
    "location": {
        "name": "Jeddah",
        "region": "Makkah",
        "country": "Saudi Arabia",
        "lat": 21.52,
        "lon": 39.22,
        "tz_id": "Asia/Riyadh",
        "localtime_epoch": 1710553656,
        "localtime": "2024-03-16 4:47"
    },
    "current": {
        "last_updated_epoch": 1710553500,
        "last_updated": "2024-03-16 04:45",
        "temp_c": 26,
        "temp_f": 78.8,
        "is_day": 0,
        "condition": {
            "text": "Clear",
            "icon": "//cdn.weatherapi.com/weather/64x64/night/113.png",
            "code": 1000
        },
        "wind_mph": 9.4,
        "wind_kph": 15.1,
        "wind_degree": 320,
        "wind_dir": "NW",
        "pressure_mb": 1010,
        "pressure_in": 29.83,
        "precip_mm": 0,
        "precip_in": 0,
        "humidity": 61,
        "cloud": 0,
        "feelslike_c": 27.4,
        "feelslike_f": 81.3,
        "vis_km": 10,
        "vis_miles": 6,
        "uv": 1,
        "gust_mph": 13.3,
        "gust_kph": 21.4
    }
}

const dummyWeatherData = {
    bulk: [
        {
            query: {
                current: {
                    temp_c: 20,
                    wind_kph: 10,
                    humidity: 50,
                    cloud: 30,
                    pressure_mb: 1000,
                },
            },
        },
        {
            query: {
                current: {
                    temp_c: 30,
                    wind_kph: 20,
                    humidity: 60,
                    cloud: 40,
                    pressure_mb: 1010,
                },
            },
        },
    ],
};

module.exports = {
    apiResponse,
    dummyWeatherData,
}