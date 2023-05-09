// Require our express module to handle the HTTP requests
const express = require('express');
// Load our environment variables
require('dotenv').config()

require('./components/discord');
//endpoints
const homeHandler = require('./endpoints/home')
const alertsHandler = require('./endpoints/alerts')
const checkRequestMiddleware = require('./endpoints/middlewares/check-request')

// Initialize our new express app
const app = express();

// Use the express.json() middleware
app.use(express.json());
const port = process.env.PORT || 8012

// Some standard welcome message on the root URL...
app.get('/', homeHandler);
// Creating the '/malware-alert' endpoint with POST request acceptance
app.post('/malware-alert', checkRequestMiddleware, alertsHandler)
// Creating the '/waf-alert' endpoint with POST request acceptance
app.post('/waf-alert', checkRequestMiddleware, alertsHandler);
// Creating the '/dos-alert' endpoint with POST request acceptance
app.post('/dos-alert', checkRequestMiddleware, alertsHandler);

// Start the server
app.listen(port, (error) => {
    if (!error) {
        console.log(process.env.APP_NAME + " started sucessfully on port " + process.env.PORT)
    }
    else {
        console.log("[ERROR][STARTUP FAILURE]", error)
    }
})