const moment = require("moment-timezone");
const getNow = () => moment.tz(Date.now(), "Asia/Ho_Chi_Minh");
module.exports = { getNow };
