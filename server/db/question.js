const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
    question: String,
    answers: [
        {
            text: String,
            correct: Boolean
        }
    ],
    level: Number,
    category: String
}, {
    versionKey: false
});

const questionModel = mongoose.model('question', QuestionSchema);

module.exports = questionModel;
