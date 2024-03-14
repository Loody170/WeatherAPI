const { createClient } = require('redis');

const client = createClient({
    password: `${process.env.REDIS_PASSWORD}`,
    socket: {
        host: `${process.env.REDIS_HOST}`,
        port: process.env.REDIS_PORT
    }
});

const connectClient = async () => {
    await client.connect();
    console.log("redis connected");
    // printCache();
}


const printCache = async () => {
    console.log("printng all keys");

    // Get all keys and their values
    const keys = await client.keys('*'); // get all keys
    // Get the value of each key
    const result = {};
    for (let key of keys) {
        result[key] = await client.get(key);
    }
    console.log(result);
}

const setCache = async (key, value) => {
    // console.log(key, value);
    await client.set(key, value);
}

const getCache = async (key) => {
    const lowerCasekey = key.toLowerCase();
    console.log("Getting cache for key: ", lowerCasekey);

    const value = await client.get(lowerCasekey);
    if(value){
        console.log("Cache hit");
        // console.log(value);
    }
    else{
        console.log("Cache miss");
    }
    return value;
}

const clearCache = async () => {
    await client.flushDb();
    console.log('Cache cleared');
};

module.exports = {
    connectClient,
    printCache,
    setCache,
    getCache,
    clearCache,
}