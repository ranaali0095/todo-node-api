const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

let {mongoose} = require('./db/mongoose');
let {Todo} = require('./models/todo');
let {User} = require('./models/users');

let app = express();
let port = process.env.PORT || 3000;

app.use(bodyParser.json());

//routes

app.post('/todos', (req, res) => {
    let todo = new Todo({
        text: req.body.text,
    });

    todo.save().then((doc) => {
        res.send(doc);
    }).catch((err) => {
        res.status(400).send(err);
    });
});

app.get('/todos', (req, res) => {
    Todo.find().then((todos) => {
        res.send({todos});
    }).catch((err) => {
        console.log('Unable to fetch todos', err);
    });
});

app.get('/todos/:id', (req, res) => {
    let id = req.params.id;

    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }

    Todo.findById(id).then((todo) => {

        if (!todo) {
            return res.status(404).send('unable to find todo with this id');
        }
        res.send({todo});

    }).catch((err) => {
        res.status(400).send(err);
    });
});

app.delete('/todos/:id', (req, res) => {
    let id = req.params.id;

    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }

    Todo.findByIdAndRemove(id).then((doc) => {

        if (!doc) {
            return res.status(404).send();
        }
        return res.send('Todo was removed successfully');

    }).catch((err) => {
        res.status(400).send();
    });

});

//start server
app.listen(port, () => {
    console.log('Started on port ', port);
});

module.exports = {app};