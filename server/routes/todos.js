let express = require('express');
let router = express.Router();

const {ObjectID} = require('mongodb');
const _ = require('lodash');

//load custom modules
let {Todo} = require('./../models/todo');
let {authenticate} = require('./../middlewares/authenticate');

router.post('/', authenticate, (req, res) => {
    let todo = new Todo({
        text: req.body.text,
        _creator: req.user._id,
    });

    todo.save().then((doc) => {
        res.send(doc);
    }).catch((err) => {
        res.status(400).send(err);
    });
});

router.get('/', authenticate, (req, res) => {
    Todo.find({
        _creator: req.user._id, // gate was added
    }).then((todos) => {
        res.send({todos});
    }).catch((err) => {
        console.log('Unable to fetch todos', err);
    });
});

router.get('/:id', authenticate, (req, res) => {
    let id = req.params.id;

    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }

    Todo.findOne({
        _id: id,
        _creator: req.user._id,
    }).then((todo) => {

        if (!todo) {
            return res.status(404).send('unable to find todo with this id');
        }
        res.send({todo});

    }).catch((err) => {
        res.status(400).send(err);
    });
});

router.delete('/:id', authenticate, (req, res) => {
    let id = req.params.id;

    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }

    Todo.findOneAndRemove({
        _id: id,
        _creator: req.user._id,
    }).then((doc) => {

        if (!doc) {
            return res.status(404).send();
        }
        return res.send({doc});

    }).catch((err) => {
        res.status(400).send();

    });

});

router.patch('/:id', authenticate, (req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, ['text', 'completed']);

    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }

    if (_.isBoolean(body.completed) && body.completed) {
        body.completedAt = new Date().getTime();
    } else {
        body.complete = false;
        body.completedAt = null;
    }

    Todo.findOneAndUpdate({
        _id: id,
        _creator: req.user._id,
    }, {$set: body}, {new: true}).then((todo) => {

        if (!todo) {
            return res.status(404).send();
        }
        return res.send({todo});
    }).catch((err) => {
        res.status(4040).send();
    });

});

module.exports = router;