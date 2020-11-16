const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const questionRoutes = require('./api/questions');
const gameRoutes = require('./api/game');

require('dotenv').config();

const { generatePin } = require('./utils');
const db = require('./db');


const PORT = process.env.PORT;
const app = express();

// Middleware
app.use(morgan('dev'));
app.use(cors());
app.use(express.json())

// Routes
app.get('/', (req, res) => {
    res.json({code: generatePin()});
})

app.use('/api/questions', questionRoutes);
app.use('/api/game', gameRoutes);

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
});