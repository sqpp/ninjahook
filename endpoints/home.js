module.exports = (req, res) => {
    const key = req.query.key;
    if (key === process.env.WEBHOOK_KEY) {
        res.status(200).json("Welcome to " + process.env.APP_NAME);
    } else {
        res.status(403).json("Unauthorized");
    }
};