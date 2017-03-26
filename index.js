var config = require('./config');
var app = new require(config.APP)(config, __dirname);
module.exports = app.route();