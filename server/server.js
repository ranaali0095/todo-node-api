//load environment
require('./config/config')

//load npm modules
const express = require('express')
const bodyParser = require('body-parser')
const {ObjectID} = require('mongodb')
const _ = require('lodash')

//load custom modules
let {mongoose} = require('./db/mongoose')
let {Todo} = require('./models/todo')
let {User} = require('./models/users')
let {authenticate} = require('./middlewares/authenticate')

let app = express()
let port = process.env.PORT || 3000

app.use(bodyParser.json())

//routes

app.post('/todos', (req, res) => {
  let todo = new Todo({
    text: req.body.text,
  })

  todo.save().then((doc) => {
    res.send(doc)
  }).catch((err) => {
    res.status(400).send(err)
  })
})

app.get('/todos', (req, res) => {
  Todo.find().then((todos) => {
    res.send({todos})
  }).catch((err) => {
    console.log('Unable to fetch todos', err)
  })
})

app.get('/todos/:id', (req, res) => {
  let id = req.params.id

  if (!ObjectID.isValid(id)) {
    return res.status(404).send()
  }

  Todo.findById(id).then((todo) => {

    if (!todo) {
      return res.status(404).send('unable to find todo with this id')
    }
    res.send({todo})

  }).catch((err) => {
    res.status(400).send(err)
  })
})

app.delete('/todos/:id', (req, res) => {
  let id = req.params.id

  if (!ObjectID.isValid(id)) {
    return res.status(404).send()
  }

  Todo.findByIdAndRemove(id).then((doc) => {

    if (!doc) {
      return res.status(404).send()
    }
    return res.send({doc})

  }).catch((err) => {
    res.status(400).send()

  })

})

app.patch('/todos/:id', (req, res) => {
  let id = req.params.id
  let body = _.pick(req.body, ['text', 'completed'])

  if (!ObjectID.isValid(id)) {
    return res.status(404).send()
  }

  if (_.isBoolean(body.completed) && body.completed) {
    body.completedAt = new Date().getTime()
  } else {
    body.complete = false
    body.completedAt = null
  }

  Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then((todo) => {

    if (!todo) {
      return res.status(404).send()
    }
    return res.send({todo})
  }).catch((err) => {
    res.status(4040).send()
  })

})

app.post('/users', (req, res) => {

  let body = _.pick(req.body,
    ['email', 'password'])
  let user = new User(body)
  user.save().then(() => {
    return user.generateAuthToken()  //call an  instance method
  }).then((token) => {
    console.log(token)
    res.header('x-auth', token).send(user)
  }).catch((err) => {
    res.status(400).send(err)
  })
})



app.get('/users/me', authenticate, (req, res) => {
  res.send(req.user)
})

//start server
app.listen(port, () => {
  console.log('Started on port ', port)
})

module.exports = {app}