const { alertType } = require('../alerts/base-alert')


module.exports = async (req, res, next) => {
    const key = req.query.key;
    const data = await req.body
    
    if (key === process.env.WEBHOOK_KEY) {
        return res.status(403).json("Unauthorized");
    }

    if (!Object.values(alertType).includes(data.alertType)) {
        return res.status(400).json("Error: Invalid incident Type")
    }

    next();
}