const { Client, ButtonBuilder, ActionRowBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');
const discord_key = process.env.DISCORD_TOKEN
const slackBotToken = process.env.SLACK_TOKEN
const { WebClient } = require('@slack/web-api');
const slack = new WebClient(slackBotToken);
const client = new Client({
    intents: []
});


const alertTypes = {
    DOS_DETECTION: 'dosDetectionIncident',
    MALWARE_CATCH: 'malwareCatch',
    WAF_INCIDENT: 'wafIncident'
};

class BaseAlert {

    alertName;
    alertType;
    alertData;

    constructor(alertData) {
        this.alertData = alertData
    }

    async sendAlertToSlack() {
        if (!slackBotToken) {
            return;
        }

        let blockMessage = [
            {
                "type": "header",
                "text": {
                    "type": "plain_text",
                    "text": "DoS Alert",
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
                        "text": `*ServerID*\n ${this.alertData.serverId}`
                    },
                    {
                        "type": "mrkdwn",
                        "text": `*Threshold*\n ${this.alertData.threshold}`
                    },
                    {
                        "type": "mrkdwn",
                        "text": `*ServerName*\n ${this.alertData.serverName}`
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
                        "url": `https://console.bitninja.io/server/${this.alertData.serverId}`
                    },
                    {
                        "type": "button",
                        "text": {
                            "type": "plain_text",
                            "text": ":whm: View WHM",
                            "emoji": true
                        },
                        "value": "click_me_123",
                        "url": `https://${this.alertData.serverName}:2087`
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
                        "text": `AlertId: ${this.alertData.alertId}`,
                        "emoji": true
                    }
                ]
            }
        ];

        await slack.chat.postMessage({
            channel: `#${process.env.SLACK_CH}`,
            text: `Malware Alert on ${this.alertData.serverName}`,
            blocks: blockMessage
        });
        const date = new Date();
        const isoDate = date.toISOString();
        console.log(`[` + isoDate + `] Slack Notification | ${this.alertData.alertId}`);
    }

    async sendAlertToDiscord() {
        if (discord_key) {
            return;
        }

        const notificationEmbed = new EmbedBuilder()
            .setTitle(this.alertName)
            .setDescription('The threshold has been reached in the last 30 minutes.')
            .setColor('#E84545')
            .addFields(
                { name: 'ServerID', value: this.alertData.serverId.toString(), inline: true },
                { name: 'ServerName', value: this.alertData.serverName.toString(), inline: true },
                { name: 'Threshold', value: this.alertData.threshold.toString(), inline: true },
            )

            //.setAuthor('BitNinja Alert')*/
            .setFooter({ text: `alertId: ${this.alertData.alertId}` })
            .setTimestamp();
        const button1 = new ButtonBuilder()
            .setLabel('WHM Access')
            .setStyle(ButtonStyle.Link)
            .setURL(`https://${this.alertData.serverName}:2087`);

        const button2 = new ButtonBuilder()
            .setLabel('View on BitNinja')
            .setStyle(ButtonStyle.Link)
            .setURL(`https://console.bitninja.io/server/${this.alertData.serverId}`);

        const row = new ActionRowBuilder().addComponents(button1, button2)
        const channel = await client.channels.fetch(process.env.DISCORD_CH); // replace CHANNEL_ID with the ID of the channel you want to send the message to
        await channel.send({ embeds: [notificationEmbed], components: [row] });
    }
}

module.exports = {
    BaseAlert,
    alertTypes
}