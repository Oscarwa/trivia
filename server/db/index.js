const mongoose = require('mongoose');

require('dotenv').config();

mongoose.connect(process.env.MONGO_CONNECTION, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const { connection: db } = mongoose;

db.on('connected', () => {
    console.info('MongoDB - Connected');
});

db.on('disconnected', () => {
	console.log('Database disconnected');
});

db.on('error', err => {
	console.error(err);
});

module.exports = db;