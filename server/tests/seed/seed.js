const {ObjectId} = require('mongodb')
const jwt = require('jsonwebtoken')
const {Todo} = require('./../../models/todo')
const {User} = require('./../../models/users')

const userOneId = new ObjectId
const userTwoId = new ObjectId
const users = [
  {
    _id: userOneId,
    email: 'rana@gamil.com',
    password: 'userOnePass',
    tokens: [
      {
        access: 'auth',
        token: jwt.sign({_id: userOneId, access: 'auth'}, 'somerandomstring').
          toString(),
      },
    ],
  }, {
    _id: userTwoId,
    email: 'ali@gamil.com',
    password: 'userTwoPass',
    tokens: [
      {
        access: 'auth',
        token: jwt.sign({_id: userTwoId, access: 'auth'}, 'somerandomstring').
          toString(),
      },
    ],
  },
]

const todos = [
  {
    _id: new ObjectId(),
    text: 'First test todo',
    _creator: userOneId,

  },
  {
    _id: new ObjectId(),
    text: 'Second test todo',
    completed: true,
    completedAt: 333,
    _creator: userTwoId,
  },
]

const populateTodos = (done) => {
  Todo.remove({}).then(() => {
    Todo.insertMany(todos)
  }).then(() => done())
}

const populateUsers = (done) => {
  User.remove({}).then(() => {
    let userOne = new User(users[0]).save()
    let userTwo = new User(users[1]).save()

    return Promise.all([userOne, userTwo])
  }).then(() => done())
}

module.exports = {
  todos,
  users,
  populateTodos,
  populateUsers,
}