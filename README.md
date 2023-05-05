#BitNinja NodeJS Webhook

## Description 
Webhook service written in NodeJS with Express for BitNinja Alerts.

## Supported Communication Apps
- Slack
- Discord

## Setup
1. Clone repository 
```git clone https://github.com/sqpp/ninjahook.git```
2. Install packages
```cd ninjahook && npm install```
3. Copy .env.example to .env
```cp .env.example .env```
4. Edit .env file with the details for your bots and app.
```nano .env```
5. Start the app
```npm run start```

## BitNinja setup

1. Visit [BitNinja Alerts](https://console.bitninja.io/alerts)
2. Add your webhook URLs such as
 - http://<ip-address/domain>:8012/malware-alert?key=<your-api-key>
 - http://<ip-address/domain>:8012/waf-alert?key=<your-api-key>
 - http://<ip-address/domain>:8012/dos-alert?key=<your-api-key>
 (Optional) You can of course use domains as well for prettier webhook URLs.

##Support

Create a GitHub issue for support or for feature requests.
