const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const http = require('http');
const socketIO = require('socket.io');

require('dotenv').config();

const app = express();
const server = http.Server(app);
const io = socketIO(server, { 
    cors: {
        origin: [process.env.CLIENT_URL]
    }
});

const questionRoutes = require('./api/questions');
const gameRoutes = require('./api/game');
const socket = require('./socket');
socket.set(io);

const db = require('./db');

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

const PORT = process.env.PORT;
server.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
});