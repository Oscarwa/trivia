const express = require('express');
const mongoose = require('mongoose');

const questionModel = require('../db/question');

const router = express.Router();

const middleware = (req, res, next) => {
    // Model validation
    const model = req.body;
    if(JSON.stringify(model) !== '{}') {
        if(model.question && model.answers && model.answers.length) {
            next();
        } else {
            res.status(400).json({error: 'You must include a question name and some answers in model'});
        }
    }
    else {
        req.body = null;
        next();
    }
};

router.post('/', middleware, async (req, res) => {
    const model = req.body;
    if(model) {
        const command = await questionModel.create(model);
        res.json(command);
    } else {
        res.json({error: 'No model provided'});
    }
});

router.get('/', async (req, res) => {
    const command = await questionModel.find({});
    res.json(command);
});

router.delete('/:id', async (req, res) => {
    const id = req.params.id.toString().trim();
    if(id) {
        const deleted = await questionModel.findByIdAndRemove(id);
        res.json({success: deleted !== null});
    } else {
        res.status(400).json({error: 'Cannot delete question'});
    }
});

router.patch('/:id', async (req, res) => {
    const id = req.params.id;
    if(IsIdValid(id)) {
        const model = req.body;
        const updated = await questionModel.findByIdAndUpdate(id, model);
        res.json(updated);
    } else {
        res.status(400).json({error: 'Cannot update question'});
    }
});

const IsIdValid = (id) => {
    if(id.toString().trim() === "") {
        return false;
    }
    if(!mongoose.Types.ObjectId.isValid(id)) {
        return false;
    }
    return true;
}

module.exports = router;