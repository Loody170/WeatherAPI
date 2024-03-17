const redis = require('../../services/redis');
const { createClient } = require('redis');
const { fetchCityWeather } = require('../../services/http');

// Mock the redis module and its functions 
jest.mock('redis', () => {
  const mockClient = {
    connect: jest.fn(),
    keys: jest.fn(),
    get: jest.fn(),
    setEx: jest.fn(),
    flushDb: jest.fn(),
    ttl: jest.fn(),
    quit: jest.fn(),
  };
  // Return a mock object that has the same functions as the redis client
  return { createClient: jest.fn(() => mockClient) };
});

// Mock the fetchCityWeather function from the http module which redis uses to update the cache
jest.mock('../../services/http', () => ({
  fetchCityWeather: jest.fn(),
}));

describe('Redis operations', () => {
  // Before each test, we clear all the mocks to ensure that the tests are isolated from each other and doesn't have any side effects from previous tests.
  // This is important because the tests are asynchronous, and the mocks are shared between the tests.
  // If we don't clear the mocks, the tests might affect each other and produce inconsistent results.
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Test the connectClient function
  it('connects to the client', async () => {
    await redis.connectClient();
    // Ensure that the connect function of the redis client is called
    expect(createClient().connect).toHaveBeenCalled();
  });

  // Test the clearCache function
  it('sets cache', async () => {
    await redis.setCache('key', 'value');
    // Ensure that the setEx function of the redis client is called with the correct arguments
    expect(createClient().setEx).toHaveBeenCalledWith('key', 15 * 60, 'value');
  });

  // Test the getCache function
  it('gets cache', async () => {
    // Mock the return value of the get function of the redis client
    createClient().get.mockResolvedValue('value');
    const value = await redis.getCache('key');
    // Ensure that the get function of the redis client is called with the correct arguments
    expect(createClient().get).toHaveBeenCalledWith('key');
    // Ensure that the value returned by the function is the same as the value returned by the redis client
    expect(value).toBe('value');
  });

  // Test the clearCache function thas is used for the polling mechanism
  it('checks expired keys and updates them', async () => {
    // Mock the return value of the keys and ttl functions of the redis client
    createClient().keys.mockResolvedValue(['key']);
    createClient().ttl.mockResolvedValue(80);
    // Mock the return value of the fetchCityWeather function from the http module
    fetchCityWeather.mockResolvedValue({ weather: 'sunny' });
    // Call the function
    await redis.checkExpiredKeys();
    // Ensure that the keys and ttl functions of the redis client are called with the correct arguments 
    expect(createClient().keys).toHaveBeenCalled();
    expect(createClient().ttl).toHaveBeenCalledWith('key');
    // Ensure that the fetchCityWeather function from the http module is called with the correct arguments
    expect(fetchCityWeather).toHaveBeenCalledWith('key');
    // Ensure that the setEx function of the redis client is called with the correct arguments
    expect(createClient().setEx).toHaveBeenCalledWith('key', 15 * 60, JSON.stringify({ weather: 'sunny' }));
  });

});