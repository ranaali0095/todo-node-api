const express = require('express');
const bodyParser = require('body-parser');

let {mongoose} = require('./db/mongoose');
let {Todo} = require('./models/todo');
let {User} = require('./models/users');

let app = express();

app.use(bodyParser.json());

//routes

app.post('/todos', (req, res) => {
  let todo = new Todo({
    text: req.body.text
  });

  todo.save().then((doc) => {
      res.send(doc);
  }).catch((err) => {
      res.status(400).send(err);
  });
});

//start server
app.listen(3000, () => {
  console.log('Started on port 3000');
});

module.exports = {app};