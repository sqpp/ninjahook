const MalwareAlert = require('../alerts/malware')
const WafAlert = require('../alerts/waf')
const DosAlert = require('../alerts/dos')

const { alertType } = require('../alerts/base-alert')


module.exports = async (req, res) => {
    const data = await req.body

    let alertInstance

    switch (data.alertType) {
        case alertType.MALWARE_CATCH:
            alertInstance = new MalwareAlert(data);
            break;
        case alertType.DOS_DETECTION:
            alertInstance = new DosAlert(data);
            break;
        case alertType.WAF_INCIDENT:
            alertInstance = new WafAlert(data);
            break;
    }

    try {
        await alertInstance.sendAlertToDiscord();
    } catch (e) {
        console.error('Failed to send alert to discord!', e)
    }
    try {
        await alertInstance.sendAlertToSlack();
    } catch (e) {
        console.error('Failed to send alert to slack channel!', e)
    }
};