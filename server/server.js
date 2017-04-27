//load environment
require('./config/config');

//load npm modules
const mongoose = require('./db/mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');
const _ = require('lodash');

//load custom modules
let {Todo} = require('./models/todo');
let {User} = require('./models/users');
let {authenticate} = require('./middlewares/authenticate');

let app = express();
let port = process.env.PORT || 3000;

app.use(bodyParser.json());

//routes

app.post('/todos', authenticate, (req, res) => {
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

app.get('/todos', authenticate, (req, res) => {
    Todo.find({
        _creator: req.user._id, // gate was added
    }).then((todos) => {
        res.send({todos});
    }).catch((err) => {
        console.log('Unable to fetch todos', err);
    });
});

app.get('/todos/:id', authenticate, (req, res) => {
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

app.delete('/todos/:id', authenticate, (req, res) => {
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

app.patch('/todos/:id', authenticate, (req, res) => {
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

app.post('/users', (req, res) => {

    let body = _.pick(req.body,
        ['email', 'password']);
    let user = new User(body);
    user.save().then(() => {
        return user.generateAuthToken();  //call an  instance method
    }).then((token) => {
        res.header('x-auth', token).send(user);
    }).catch((err) => {
        res.status(400).send(err);
    });
});

app.get('/users/me', authenticate, (req, res) => {
    res.send(req.user);
});

app.post('/users/login', (req, res) => {

    let body = _.pick(req.body, ['email', 'password']);

    User.findByCredentials(body.email, body.password).then((user) => {
        user.generateAuthToken().then((token) => {
            res.header('x-auth', token).send(user);
        });
    }).catch((err) => {
        res.status(400).send();
    });
});

app.delete('/users/me/token', authenticate, (req, res) => {
    req.user.removeToken(req.token).then((user) => {
        res.status(200).send(user);
    }).catch((e) => {
        res.status(400).send();
    });
});

//start server
app.listen(port, () => {
    console.log('Started on port ', port);
});

module.exports = {app};