// Require our express module to handle the HTTP requests
const express = require('express');
const Discord = require('discord.js');
const { WebClient } = require('@slack/web-api');
// Load our environment variables
require('dotenv').config()
// Our API keys
const key = process.env.WEBHOOK_KEY
const discord_key = process.env.DISCORD_TOKEN
const slackBotToken = process.env.SLACK_TOKEN
console.log(slackBotToken)
const slack = new WebClient(slackBotToken);
const { Client, Intents, ButtonBuilder, ActionRowBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');
const client = new Client({
  intents: []
});


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
app.get('/', (req, res) => {
    const key = req.query.key;
    if (key === process.env.WEBHOOK_KEY) {
      res.status(200).json("Welcome to " + process.env.APP_NAME);
    } else {
      res.status(403).json("Unauthorized");
    }
  });

  app.post('/malware-alert', async (req, res) => {
    const key = req.query.key;
    const data = await req.body
    if (key === process.env.WEBHOOK_KEY) {
        if (data.alertType == 'malwareCatch') {
            if (discord_key) {
                const notificationEmbed = new EmbedBuilder ()
                    .setTitle('Malware Catch')
                    .setDescription('The threshold has been reached in the last 30 minutes.')
                    .setColor('#E84545')
                    .addFields(
                        { name: 'ServerID', value: data.serverId.toString(), inline: true },
                        { name: 'ServerName', value: data.serverName.toString(), inline: true },
                        { name: 'Threshold', value: data.threshold.toString(), inline: true },
                    )
                    .setFooter({text: `alertId: ${data.alertId}`})
                    .setTimestamp();
                const button1 = new ButtonBuilder()
                    .setLabel('WHM Access')
                    .setStyle(ButtonStyle.Link)
                    .setURL(`https://${data.serverName}:2087`);
                const button2 = new ButtonBuilder()
                    .setLabel('View on BitNinja')
                    .setStyle(ButtonStyle.Link)
                    .setURL(`https://console.bitninja.io/server/${data.serverId}`);
                const row = new ActionRowBuilder().addComponents(button1, button2)
                const channel = await client.channels.fetch(process.env.CHANNELID);
                await channel.send({ embeds: [notificationEmbed], components: [row] });
                const date = new Date();
                const isoDate = date.toISOString();
                console.log(`[` + isoDate + `] Discord Notification | ${data.alertId}`);
                res.status(200).json("OK")
                
            }
            if (slackBotToken) {
                let blockMessage = [
                        {
                            "type": "header",
                            "text": {
                                "type": "plain_text",
                                "text": "Malware Alert",
                                "emoji": true
                            }
                        },
                        {
                            "type": "divider"
                        },
                        {
                            "type": "section",
                            "fields": [
                                {
                                    "type": "mrkdwn",
                                    "text": `*ServerID*\n ${data.serverId}`
                                },
                                {
                                    "type": "mrkdwn",
                                    "text": `*Threshold*\n ${data.threshold}`
                                },
                                {
                                    "type": "mrkdwn",
                                    "text": `*ServerName*\n ${data.serverName}`
                                }
                            ]
                        },
                        {
                            "type": "actions",
                            "elements": [
                                {
                                    "type": "button",
                                    "text": {
                                        "type": "plain_text",
                                        "text": ":bitninja: View on BitNinja",
                                        "emoji": true
                                    },
                                    "value": "click_me_123",
                                    "url": `https://console.bitninja.io/server/${data.serverId}`
                                },
                                {
                                    "type": "button",
                                    "text": {
                                        "type": "plain_text",
                                        "text": ":whm: View WHM",
                                        "emoji": true
                                    },
                                    "value": "click_me_123",
                                    "url": `https://${data.serverName}:2087`
                                }
                            ]
                        },
                        {
                            "type": "divider"
                        },
                        {
                            "type": "context",
                            "elements": [
                                {
                                    "type": "plain_text",
                                    "text": `AlertId: ${data.alertId}`,
                                    "emoji": true
                                }
                            ]
                        }
                    ]

                    try {
                        const result = await slack.chat.postMessage({
                          channel: '#general',
                          text: `Malware Alert on ${data.serverName}`,
                          blocks: blockMessage
                        });
                        const date = new Date();
                        const isoDate = date.toISOString();
                        console.log(`[` + isoDate + `] Slack Notification | ${data.alertId}`);
                      } catch (error) {
                        console.error(error);
                      }
                      
            }
        }
        else {
            res.status(400).json("Error: Invalid incident Type")
        }
    } else {
        res.status(403).json("Unauthorized");
    }
});


// Creating the '/waf-alert' endpoint with POST request acceptance
app.post('/waf-alert', async (req, res) => {
    const key = req.query.key;
    const data = req.body
    if (key === process.env.WEBHOOK_KEY) {
        if (data.alertType === 'wafIncident') {
            if (discord_key) {
                const notificationEmbed = new EmbedBuilder ()
                    .setTitle('WAF Rule Triggered')
                    .setDescription('The threshold has been reached in the last 30 minutes.')
                    .setColor('#E84545')
                    .addFields(
                        { name: 'ServerID', value: data.serverId.toString(), inline: true },
                        { name: 'ServerName', value: data.serverName.toString(), inline: true },
                        { name: 'Threshold', value: data.threshold.toString(), inline: true },
                    )
                    //.setAuthor('BitNinja Alert')*/
                    .setFooter({text: `alertId: ${data.alertId}`})
                    .setTimestamp();
            const button1 = new ButtonBuilder()
                    .setLabel('WHM Access')
                    .setStyle(ButtonStyle.Link)
                    .setURL(`https://${data.serverName}:2087`);

                const button2 = new ButtonBuilder()
                    .setLabel('View on BitNinja')
                    .setStyle(ButtonStyle.Link)
                    .setURL(`https://console.bitninja.io/server/${data.serverId}`);

                const row = new ActionRowBuilder().addComponents(button1, button2)
                const channel = await client.channels.fetch('1103643686765592696'); // replace CHANNEL_ID with the ID of the channel you want to send the message to
                await channel.send({ embeds: [notificationEmbed], components: [row] });
                res.status(200).json("OK")
            }
        }
        else {
            res.status(400).json("Error: Invalid incident Type")
        }
    } else {
        res.status(403).json("Unauthorized");
    }
});

// Creating the '/dos-alert' endpoint with POST request acceptance
app.post('/dos-alert', async(req, res) => {
    if (key === process.env.WEBHOOK_KEY) {
        if (data.alertType === 'dosDetectionIncident') {
            if (discord_key) {
            const notificationEmbed = new EmbedBuilder ()
                .setTitle('Dos Detection Incident')
                .setDescription('The threshold has been reached in the last 30 minutes.')
                .setColor('#E84545')
                .addFields(
                    { name: 'ServerID', value: data.serverId.toString(), inline: true },
                    { name: 'ServerName', value: data.serverName.toString(), inline: true },
                    { name: 'Threshold', value: data.threshold.toString(), inline: true },
                )
                
                //.setAuthor('BitNinja Alert')*/
                .setFooter({text: `alertId: ${data.alertId}`})
                .setTimestamp();
          const button1 = new ButtonBuilder()
                .setLabel('WHM Access')
                .setStyle(ButtonStyle.Link)
                .setURL(`https://${data.serverName}:2087`);

            const button2 = new ButtonBuilder()
                .setLabel('View on BitNinja')
                .setStyle(ButtonStyle.Link)
                .setURL(`https://console.bitninja.io/server/${data.serverId}`);

            const row = new ActionRowBuilder().addComponents(button1, button2)
            const channel = await client.channels.fetch('1103643686765592696'); // replace CHANNEL_ID with the ID of the channel you want to send the message to
            await channel.send({ embeds: [notificationEmbed], components: [row] });
            res.status(200).json("OK")
        }
    }
    else {
        res.status(400).json("Error: Invalid incident Type")
    }
} else {
    res.status(403).json("Unauthorized");
}
});

// Start the server
app.listen(port, (error) => {
  if(!error)
    console.log(process.env.APP_NAME + " started sucessfully on port " + process.env.PORT)
  else 
    console.log("[ERROR][STARTUP FAILURE]", error)
  }
);

