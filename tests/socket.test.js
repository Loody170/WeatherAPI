const socket = require('../socket');
const io = require('socket.io');

// Mock the 'socket.io' module
jest.mock('socket.io');

describe('socket', () => {
  beforeEach(() => {
    // Clear all mocks before each test to ensure that the tests are isolated
    jest.clearAllMocks();
  });

  it('initializes socket.io', () => {
    // Mock server object
    const mockServer = {};

    // Mock socket.io object
    const mockIo = {};

    // Make 'socket.io' return the mock socket.io object
    io.mockReturnValue(mockIo);

    // Initialize socket.io
    const result = socket.init(mockServer);

    // Check that 'socket.io' was called with the mock server
    expect(io).toHaveBeenCalledWith(mockServer);
    // Check that 'init' returned the mock socket.io object
    expect(result).toBe(mockIo);
  });

  it('gets the initialized socket.io object', () => {
    // Mock socket.io object
    const mockIo = {};
    // Make 'socket.io' return the mock socket.io object
    io.mockReturnValue(mockIo);

    // Initialize socket.io
    socket.init({});

    // Get the initialized socket.io object
    const result = socket.getIO();
    // Check that 'getIO' returned the mock socket.io object
    expect(result).toBe(mockIo);
  });
});