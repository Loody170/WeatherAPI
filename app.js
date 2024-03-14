const express = require('express');
require('dotenv').config();

const redisServer = require('./redis');
const weatherRoutes = require('./routes/weather');

const app = express();
app.use(express.json());

app.use("/weather", (req, res, next) => {
    next();
}, weatherRoutes);

app.use((error, req, res, next) => {
    const status = error.statusCode || 500;
    const message = error.message;
    const data = error.data;
    res.status(status).json({ message: message, data: data });
});


const startApp = () => {
    redisServer.connectClient();
    app.listen(process.env.PORT || 8000);
    console.log('Server started');
}

startApp();

