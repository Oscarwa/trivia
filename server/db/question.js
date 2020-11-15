const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
    question: String,
    answers: [
        {
            text: String,
            correct: { type: Boolean, default: false }
        }
    ],
    level: {type: String, enum: ['easy', 'normal', 'hard', 'expert']},
    type: { type: String, default: 'text' },
    category: { type: String }
}, {
    versionKey: false
});

const questionModel = mongoose.model('question', QuestionSchema);

module.exports = questionModel;
