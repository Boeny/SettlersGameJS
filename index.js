var config = require('./config');
var App = require(config.APP);
var app = new App(config, __dirname);
module.exports = app.route();