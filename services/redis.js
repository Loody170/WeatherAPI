//T his file contains the logic for connecting to the redis cache server on the cloud, and for setting, getting, and clearing the cache
// It also contains a polling mechanism to check for expired keys and update them if necessary
// Other files can import the functions from this file to use the cache

const { fetchCityWeather } = require('./http');
const THRESHOLD = 90; // 90 seconds

const { createClient } = require('redis');

// The redis client is created and configured to connect to the redis cache server on the cloud
const client = createClient({
    password: `${process.env.REDIS_PASSWORD}`,
    socket: {
        host: `${process.env.REDIS_HOST}`,
        port: process.env.REDIS_PORT
    }
});

// A function to connect to the redis cache server
const connectClient = async () => {
    await client.connect();
    console.log("redis connected");

    // This is for testing purposes
    // await printCache();
}

// This function prints all the keys and their values in the cache
// It is used for testing purposes just to see what's inside the cache and can be removed in production
const printCache = async () => {
    console.log("Printng all keys");

    // Get all keys in the cache
    const keys = await client.keys('*');
    // Get the value of each key
    const result = {};
    for (let key of keys) {
        result[key] = await client.get(key);
    }
    // Print the result
    console.log(result);
}

// A function to set a key-value pair in the cache with an expiry time
const setCache = async (key, value) => {
    // According to the WeatherAPI documentation, the data is updated every 10-15 minutes
    // So, we can set the expiry time to 15 minutes
    await client.setEx(key, 15 * 60, value);
}

// A function to get the value of a key from the cache
const getCache = async (key) => {
    // To avoid unwanted cache misses due to case sensitivity, we always convert the key to lowercase
    const lowerCasekey = key.toLowerCase();
    const value = await client.get(lowerCasekey);

    // Log whether the key was found in the cache or not for testing purposes
    // if (value) {
    //     console.log("Cache hit");
    // }
    // else {
    //     console.log("Cache miss");
    // }
    return value;
}

// A function to clear the cache also for testing purposes
const clearCache = async () => {
    await client.flushDb();
    console.log('Cache cleared');
};

// A function that implements a polling mechanism to check for expired keys and update them if necessary
const checkExpiredKeys = async () => {
    // console.log("Polling for expired keys");
    // Get a list of all the keys in the cache
    const keys = await client.keys('*');

    // Check each key
    for (let key of keys) {
        try {
            // Get the time to live (TTL) of the key
            const ttl = await client.ttl(key);
            // If the TTL is less than the threshold, update the key with a new value from the WeatherAPI
            // The threshold is set to 90 seconds to ensure that the key is updated before it expires
            if (ttl <= THRESHOLD) {
                console.log(`Key ${key} about to expire in ${ttl} seconds, updating it...`);
                const newValue = await fetchCityWeather(key);

                await client.setEx(key, 15 * 60, JSON.stringify(newValue));
                console.log(`Key ${key} has been updated`);
            }
        }
        // Log any errors that occur
        catch (err) {
            console.log("error: ", err);
        }
    };
}

// Set up the polling mechanism to check for expired keys every 60 seconds
// This is done to ensure that the cache is always up to date
setInterval(checkExpiredKeys, 1000 * 60);

// Export the functions to be used in other files
module.exports = {
    connectClient,
    printCache,
    setCache,
    getCache,
    checkExpiredKeys,
    clearCache,
}