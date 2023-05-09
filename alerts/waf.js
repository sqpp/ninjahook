const { BaseAlert } = require("./base-alert");

class WAFAlert extends BaseAlert {
    alertName = 'WAF Alert'
}

module.exports = WAFAlert