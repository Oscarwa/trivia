const express = require('express');
const mongoose = require('mongoose');
const { generatePin, sanitizeString } = require('../utils');

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

// router.delete('/:id', async (req, res) => {
//     const id = req.params.id.toString().trim();
//     if(id) {
//         const deleted = await questionModel.findByIdAndRemove(id);
//         res.json({success: deleted !== null});
//     } else {
//         res.status(400).json({error: 'Cannot delete question'});
//     }
// });

// router.patch('/:id', async (req, res) => {
//     const id = req.params.id;
//     if(IsIdValid(id)) {
//         const model = req.body;
//         const updated = await questionModel.findByIdAndUpdate(id, model);
//         res.json(updated);
//     } else {
//         res.status(400).json({error: 'Cannot update question'});
//     }
// });

module.exports = router;