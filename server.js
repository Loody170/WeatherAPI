const app = require('./app');
const socketController = require('./controllers/socket_controller');
const redisServer = require('./services/redis');

// This function Starts the app
// It starts the express server, connects to the redis cache server on the cloud, and initializes the websocket connection 
const startApp = () => {
    redisServer.connectClient();
    const server = app.listen(process.env.PORT || 8000);
    const io = require("./socket").init(server);
    socketController.getLiveWeatherData();
    console.log('Server started');
}

startApp();