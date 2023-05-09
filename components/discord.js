const { Client } = require('discord.js');
const discord_key = process.env.DISCORD_TOKEN

const client = new Client({
    intents: []
});

if (discord_key) {
    client.on('ready', () => {
        console.log(`Discord bot ${client.user.tag} has started`);
    });
    client.login(discord_key);
}

module.exports = client