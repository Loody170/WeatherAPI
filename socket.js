// The purpose of this file is to initialize the websocket connection
let io;

module.exports = {
    // The server is passed as a parameter to the init function
    init: server => {
        io = require('socket.io')(server);
        console.log("Socket.io initialized");
        return io;
    },
    // The function returns the io object which is used to emit events
    getIO: () => {
        // If the io object is not initialized, an error is thrown
        if (!io) {
            throw new Error('Socket.io not initialized!');
        }
        return io;
    }
};
