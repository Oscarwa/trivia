const mongoose = require('mongoose');
const { QuestionSchema } = require('./question');

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
    
}, {
    versionKey: false
});

const gameModel = mongoose.model('game', GameSchema);

module.exports = gameModel;
