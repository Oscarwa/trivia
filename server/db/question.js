const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
    question: String,
    answers: [
        {
            text: String,
            correct: { type: Boolean, default: false }
        }
    ],
    level: {type: Number, default: 50},
    category: { type: String, default: 'text' }
}, {
    versionKey: false
});

const questionModel = mongoose.model('question', QuestionSchema);

module.exports = questionModel;
