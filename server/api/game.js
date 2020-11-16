const express = require('express');
const mongoose = require('mongoose');
const { generatePin, sanitizeString } = require('../utils');
const socket = require('../socket');

const gameModel = require('../db/game');

const router = express.Router();


router.post('/create', async (req, res) => {
    const name = req.body && req.body.name;
    if(name) {
        const cleanName = sanitizeString(name);
        const model = {
            code: generatePin(),
            admin: cleanName,
            players: [
                {name:cleanName, displayName: name, score: 0}
            ]
        };
        const command = await gameModel.create(model);
        ioConnect(socket.io, command.code);
        res.json(command);
    } else {
        res.json({error: 'No name provided'});
    }
});

router.post('/join/:code', async (req, res) => {
    const name = req.body && req.body.name;
    if(name) {
        const cleanName = sanitizeString(name);
        const code = req.params.code;
        if(code) {
            const game = await gameModel.findOne({code});
            if(game.players.find(p => p.name === cleanName)) {
                res.status(400).json({error: `User '${name}' already joined`});
            }
            else {
                game.players.push({name: cleanName, displayName: name, score: 0});
                const dbRes = await game.save();
                ioConnect(socket.io, dbRes.code);
                res.json(dbRes);
            }
            //res.json(game);
        } else {

            res.status(400).json({error: 'No code provided'});
        }
    } else {
        res.status(400).json({error: 'No name provided'});
    }
});

router.get('/:code', async (req, res) => {
    const code = req.params.code;
    if(code) {
        const command = await gameModel.findOne({code});
        res.json(command);
    } else {
        res.status(400).json({error: 'No code provided'});
    }
});

const ioConnect = (io, code) => {
    io.emit('WS', 'test');
    io.emit(`game/${code}`, 'user connected');
}

module.exports = router;