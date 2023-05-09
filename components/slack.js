const slackBotToken = process.env.SLACK_TOKEN
const { WebClient } = require('@slack/web-api');
const slack = new WebClient(slackBotToken);

module.exports = slack;