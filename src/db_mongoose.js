const mongoose = require('mongoose'),
	config = require('../config/config');

mongoose.connect(config.databaseUrl);

const db = mongoose.connection;

module.exports = mongoose;