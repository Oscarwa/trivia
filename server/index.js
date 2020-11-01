const express = require('express');
const morgan = require('morgan');
const { generatePin } = require('./utils');
require('dotenv').config();
const db = require('./db');


const PORT = process.env.PORT;
const app = express();

// Middleware
app.use(morgan('dev'));
app.use(express.json())

// Routes
app.get('/', (req, res) => {
    res.json({code: generatePin()});
})

app.use('/api/question', require('./api/questions'));

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
});