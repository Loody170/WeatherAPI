# Weather API 

This project is built using Node.js and Express framework. I used the MVC (Model-View-Controller) design pattern for structuring the application's architecture. This pattern helps separate concerns and organize the code structure.
The API I chose for this assignment is [WeatherAPI](https://www.weatherapi.com/). It is free to use and has excellent documentation and endpoints to use.

### Endpoint: GET /weather/:city
Retrieves the current weather for a specified city.
### Request Format
**URL Parameters:**
- `city`: The name of the city to retrieve the weather for.

### Response Format

- **Status Code:** `200 OK`
- **Body:** A JSON object that contains the weather data for the specified city
```json
{
  "message": "Fetched city weather data successfully.",
  "data": {
  }
}
```


### Brief explanation
- For all the first 3 tasks, I created a middleware that takes requests coming to the parent route `/weather` and redirects to different controllers based on the requested child route.

- The above endpoint simply returns the weather data for the required city. This task required using a cache to store fetched data. I had a lot of options to cache data but eventually I chose Redis because of its very fast speed, scalability, and efficiency. I created a Redis server on the cloud and connected it to my project. I chose a cloud option because it’s reliable and easier when deploying the app.

- According to the WeatherAPI website, the weather data is updated every 10 to 15 minutes. For this reason, I chose to cache fetched weather data with an expiry date or TTL (Time to Live) of 15 minutes. I implemented the polling mechanism to check the cache every minute to see if any records are about to expire. If the record’s remaining TTL is 90 seconds or less, then it will be updated with new data fetched from the API before the record expires.

### Endpoint: POST /weather/bulk

### Request Format

**Headers**:
- `Content-Type: application/json`

**Request Body:**
The request body should be a JSON object with a `cities` key containing an array of city names.
    Example:
```json
    {
      "cities": ["Jeddah", "Tayif", "Riyadh"]
    }
```
    
### Response Format
- **Status Code:** `200 OK`
- **Response Body:**
The response will be a JSON object that contains an array of objects inside for different cities weather data
Example:
```json
{
    "message": "Cities list weather data fetched successfully.",
    "data":{
        "bulk":[
            // Weather data objects
        ]
    }
}
```

### Brief Explanation

- For this task, I implemented a controller that takes the list of cities from the POST request body to be sent to WeatherAPI.
- Upon reading WeatherAPI’s documentation, I found an endpoint called “bulk” that does something similar to the requirement of this task. It takes a list of queries (cities names in our case) and responds with one big object that contains all the weather data for the cities. 
- The “bulk” endpoint accepts an array with each query being its own object inside it with a certain structure (for example: `[{q:”city1”}, {q:”city2”}]`). For this reason, I transformed the list the server gets from the client’s POST request to the wanted structure before sending them to the API and receiving the data which is to be sent back to the client.
- **IMPORTANT NOTE:** The “bulk” endpoint the WeatherAPI offers is exclusive to paid tiers and is not available in the free tier. Fortunately, the website gave me a free trial to the paid tier that expires on March 27th, 2024. This endpoint may not work properly if my free trial expires, but my integration and implementation is correct and tested. 

### ENDPOINT: GET /weather/statistics
Retrieves aggregated statistical weather data for all cities.

### Response Format

- **Status Code:** `200 OK`
- **Body:** A JSON object that contains the aggregated weather statistics
  ```json
  {
    "message": "Weather statistics fetched successfully.",
    "data": {
    }
  }
  ```
  
 ### Brief Explanation
The task description mentioned getting aggregated statistics for "all cities", so I assumed it meant the 8 cities mentioned in the assignment. This endpoint’s controller function sends a request with all the city names using the same fetch function I used for task 2, retrieves the response, and performs calculations. 

The statistics I chose to calculate are the average, minimum, and maximum values of the following weather parameters:
- Temperature in Celsius
- Wind speed in km/h
- Humidity percentage
- Cloud coverage percentage
- Pressure in millibar

The stats are calculated and sent back to the client that sent the GET request to this endpoint.

### ENDPOINT: /weather/live (WebSocket)
Clients can connect to this endpoint to start receiving live weather data. After connecting, clients should emit a `"live"` event with a list of cities for which they want to receive weather data.

### Response Format
An array of JSON objects periodically sent every 2 minutes.
```json
[
{
  "name": "string",
  "coordinates": {
    "lat": "number",
    "lon": "number"
  },
  "temperatureC": "number"
},
  // ... more objects for additional cities
]
```

### Brief Explanation
For this task, I implemented a WebSocket connection to send live weather data to connected clients. I used the socket.io library to implement web sockets, and the server waits for clients to join on the “live” event. Once a client joins, the server periodically (every 2 minutes) sends updated weather data for the list of cities the client attached in their request.

### Task 5: /weather/live-radar WebSocket Implementation for a Web Page
### Brief Explanation
Based on my understanding of this task, the requirement was to create a web page that acts as a client, subscribing to the “weather/live” endpoint discussed in the previous task. The received data is then used to display live weather information on a map showing temperatures for all cities (assuming all cities refer to the 8 cities mentioned in the assignment).

This task sounds more like a client-side and front-end task. Instead of creating a normal webpage using vanilla HTML, I opted to create a front-end web app using the React.js framework that acts as the Web Socket client. This web app includes a `/live-radar` route that establishes a connection to my backend and receives live weather data. The data is then rendered on the map of Saudi Arabia, with coordinates for every city with periodic updates for the weather data, similar to the example provided in the assignment.

I deployed the web app that subscribes to the backend. It can be visited from this link: [Weather Map App](insert_link_here)

### Testing

I implemented a total of 15 different unit tests to ensure the functionality and reliability of the API. I tested major parts such as the routes and controllers, cache server, helper functions, and the WebSocket connection.

I mainly used three libraries for testing:

- **Jest**: A widely used library for testing JavaScript applications.
- **Supertest**: A library for testing HTTP servers in Node.js.
- **Nock**: A powerful library for mocking HTTP requests in Node.js. It allows you to intercept outgoing HTTP requests and define custom responses.

## Running and Testing the Application

### Prerequisites
Before running and testing the application, ensure you have the following installed:
- Node.js (version 20.11.0)
- npm (version 10.2.4)

### Installation
1. Clone the repository to your local machine:
```bash
   git clone https://github.com/Loody170/WeatherAPI.git
  ```
2. Install dependencies using npm:
```bash
npm install
```
### Configuration
Set up environment variables:
- Create a `.env` file in the root directory.
- Define the following variables:
  ```bash
  API_KEY = <your_weatherapi_key>
  REDIS_HOST = <your_redis_server_url>
  REDIS_PASSWORD = <your_redis_server_password>
  REDIS_PORT = <your_redis_server_port
  ```
    replace the values with your own environmental variables
    
### Running the Application
To start the server, run the following command:
```bash
npm start
```
### Running Tests
To execute unit tests, run the following command:
```bash
npm test
```
