const express = require('express');
const mongoose = require('mongoose');
const { generatePin, sanitizeString } = require('../utils');
const socket = require('../socket');

const { gameModel, gameStates } = require('../db/game');

const router = express.Router();


router.post('/create', async (req, res) => {
    const name = req.body && req.body.name;
    if(name) {
        const cleanName = sanitizeString(name);
        const maxPlayers = req.body.maxPlayers;
        const type = req.body.type;
        const model = {
            code: generatePin(),
            admin: cleanName,
            players: [
                {name:cleanName, displayName: name, score: 0}
            ],
            maxPlayers,
            type,
            state: gameStates.waiting
        };
        const command = await gameModel.create(model);
        ioConnect(socket.io, command.code, `Game '${command.code}' created.`, command);
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

            if(game.state === gameStates.waiting) {
                if(game.players.length !== game.maxPlayers) {
                    if(game.players.find(p => p.name === cleanName)) {
                        res.status(400).json({error: `User '${name}' already joined`});
                    }
                    else {
                            game.players.push({name: cleanName, displayName: name, score: 0});
                            const dbRes = await game.save();
                            ioConnect(socket.io, dbRes.code, `${name} joined`, dbRes);
                            res.json(dbRes);
                    }
                } else {
                    res.status(400).json({error: `Game '${code}' is full - max capacity is ${game.maxPlayers}`});
                }
            } else {
                res.status(400).json({error: `Cannot join game, because is active or finished`});
            }
        } else {

            res.status(400).json({error: 'No code provided'});
        }
    } else {
        res.status(400).json({error: 'No name provided'});
    }
});
router.post('/start/:code', async (req, res) => {
    const code = req.params.code;
    if(code) {
        const game = await gameModel.findOne({code});
        if(game.state !== gameStates.waiting) {
            res.status(500).json({error: `Could not start game, current state is ${game.state}`});
        }
        else {
            game.state = gameStates.active;
            const dbRes = await game.save();
            ioConnect(socket.io, dbRes.code, 'Game started', {state: gameStates.active});
            res.json(dbRes);
        }
    } else {

        res.status(400).json({error: 'No code provided'});
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

const ioConnect = (io, code, msg, data) => {
    io.emit('WS', 'test');
    io.emit(`game/${code}`, {message: msg, data});
}

module.exports = router;