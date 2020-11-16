const mongoose = require('mongoose');
const { QuestionSchema } = require('./question');

const gameStates = {
    waiting: 'wait',
    active: 'active',
    finished: 'finish'
};

const GameSchema = new mongoose.Schema({
    code: String,
    admin: String,
    players: [
        {
            displayName: String,
            name: String,
            score: { type: Number, default: 0 }
        }
    ],
    questions: [QuestionSchema],
    state: {type: String, enum: Object.values(gameStates), default: gameStates.waiting},
    maxPlayers: {type: Number, default: 2},
    type: {type: String, default: 'points'},
    createdOn: {type: Date, default: Date.now }
}, {
    versionKey: false
});


const gameModel = mongoose.model('game', GameSchema);

module.exports = {
    gameModel,
    gameStates
};
