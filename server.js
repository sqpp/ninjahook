// Require our express module to handle the HTTP requests
const express = require('express');
// Load our environment variables
require('dotenv').config()
// Our API keys
const discord_key = process.env.DISCORD_TOKEN
const { Client } = require('discord.js');
const client = new Client({
    intents: []
});

//endpoints
const homeHandler = require('./endpoints/home')
const alertsHandler = require('./endpoints/alerts')
const checkRequestMiddleware = require('./endpoints/middlewares/check-request')

// Initialize our new express app
const app = express();

// Use the express.json() middleware
app.use(express.json());
const port = process.env.PORT || 8012

if (discord_key) {
    client.on('ready', () => {
        console.log(`Discord bot ${client.user.tag} has started`);
    });
    client.login(discord_key);
}

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
    if (!error)
        console.log(process.env.APP_NAME + " started sucessfully on port " + process.env.PORT)
    else
        console.log("[ERROR][STARTUP FAILURE]", error)
})