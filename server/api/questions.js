const express = require('express');

const questionModel = require('../db/question');

const router = express.Router();

const middleware = (req, res, next) => { next() };

router.post('/', async (req, res, next) => {
    const model = req.body;
    // console.log('post', model);
    const command = await questionModel.create(model);
    res.json(command);
});

module.exports = router;