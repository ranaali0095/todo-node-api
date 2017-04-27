const expect = require('expect')
const request = require('supertest')
const {ObjectId} = require('mongodb')

const {app} = require('./../server')
const {Todo} = require('./../models/todo')
const {User} = require('./../models/users')
const {todos, populateTodos, users, populateUsers} = require('./seed/seed')

//populate test database
beforeEach(populateUsers)
beforeEach(populateTodos)

describe('POST /todos', () => {

  it('should create a new todo', (done) => {
    let text = 'Test todo text'

    request(app).
      post('/todos').
      set('x-auth', users[0].tokens[0].token).
      send({text}).
      expect(200).
      expect((res) => {

        expect(res.body.text).toBe(text)

      }).
      end((err, res) => {
        if (err) {
          return done(err)
        }
        Todo.find({text}).then((todos) => {
          expect(todos.length).toBe(1)
          expect(todos[0].text).toBe(text)
          done()
        }).catch((err) => done(err))
      })
  })

  it('should not create with invalid body data', (done) => {

    request(app).
      post('/todos').
      set('x-auth', users[0].tokens[0].token).
      send({}).
      expect(400).
      end((err, res) => {
        if (err) {
          return done(err)
        }

        Todo.find().then((todos) => {
          expect(todos.length).toBe(2)
          done()
        }).catch((err) => done(err))

      })
  })
})

describe('GET /todos', () => {

  it('should get all the todos', (done) => {

    request(app).get('/todos').expect(200).expect((res) => {
      expect(res.body.todos.length).toBe(1)
    }).end(done)

  })

})

describe('GET /todos/:id', () => {

  it('should retunn the todo', (done) => {
    request(app).
      get(`/todos/${todos[0]._id.toHexString()}`).
      expect(200).expect((res) => {
        expect(res.body.todo.text).toBe(todos[0].text)
      }).
      end(done)
  })

  it('should return 404 if todo not found', (done) => {
    request(app).
      get(`/todos/${(new ObjectId).toHexString}`).
      expect(404).
      end(done)
  })

  it('should return non-object ids', (done) => {
    request(app).get('todos/1234').expect(404).end(done)
  })

})

describe('DELETE /todos/:id', () => {

  it('should remove a todo', (done) => {
    let hexId = todos[1]._id.toHexString()

    request(app).delete(`/todos/${hexId}`).expect(200).expect((res) => {
      expect(res.body.todos.id).toBe(hexId)
    }).end((err, res) => {
      Todo.findById(hexId).then((todo) => {
        expect(todo).toNotExist()
        done()
      }).catch((err) => {
        done(err)
      })
    })
  })

  it('should return 404 if todo not found', (done) => {
    request(app).
      delete(`/todos/${(new ObjectId).toHexString}`).
      expect(404).
      end(done)
  })

  it('should return 404 if objectId is invalid', (done) => {
    request(app).delete('todos/1234').expect(404).end(done)
  })

})

describe('PATCH /todos/:id', () => {
  it('should update the todo', (done) => {
    //grab id of first item
    let hexId = todos[1]._id.toHexString()
    let text = 'Changed text of todo'
    let completed = true

    //update text
    request(app).
      patch(`/todos/${hexId}`).
      send({text, completed}).
      expect(200).
      expect((res) => {
        expect(res.body.todo.text).toBe(text)
        expect(res.body.todo.completed).toBe(completed)
        expect(res.body.todo.completedAt).toBeA('number')

      }).
      end(done)
  })

  it('should clear completedAt when todo is not completed', (done) => {
    let hexId = todos[1]._id.toHexString()
    let text = 'Changed text of todo second time'
    let completed = false

    request(app).
      patch(`/todos/${hexId}`).
      send({text, completed}).
      expect(200).
      expect((res) => {
        expect(res.body.todo.text).toBe(text)
        expect(res.body.todo.completed).toBe(completed)
        expect(res.body.todo.completedAt).toNotExist()

      }).
      end(done)

  })

})

describe('GET /users/me', () => {
  it('should return user if authenticated', (done) => {
    request(app).
      get('/users/me').
      set('x-auth', users[0].tokens[0].token).
      expect(200).
      expect((res) => {
        expect(res.body._id).toBe(users[0]._id.toHexString())
        expect(res.body.email).toBe(users[0].email)
      }).
      end(done)
  })

  it('should return 401 if not authenticated', (done) => {
    request(app).get('/users/me').expect(401).expect((res) => {
      expect(res.body).toEqual({})
    }).end(done)

  })
})

describe('POST /users', () => {

  it('should create a user', (done) => {
    let email = 'example@gmail.com'
    let password = '123test'

    request(app).
      post('/users').
      send({email, password}).
      expect(200).
      expect((res) => {
        expect(res.headers['x-auth']).toExist()
        expect(res.body._id).toExist()
        expect(res.body.email).toBe(email)

      }).
      end((err) => {
        if (err) {
          return done(err)
        }

        User.findOne({email}).then((user) => {
          expect(user).toExist()
          expect(user.password).toNotBe(password)
          done()
        })
      })
  })

  it('should return validation errors if request invalid', (done) => {
    let email = 'example'
    let password = '12w'

    request(app).post('/users').send({email, password}).expect(400).end(done)
  })

  it('should not create a user if email already exist', (done) => {
    let email = users[0].email
    let password = '1234567'
    request(app).post('/users').send({email, password}).expect(400).end(done)
  })

})

describe('DELETE /users/me/token', () => {

  it('should remove auth token on logout', (done) => {
    request(app).
      delete('/users/me/token').
      set('x-auth', users[0].tokens[0].token).
      expect(200).
      end((err) => {
        if (err) {
          done(err)
        }
        User.find({_id: users[0]._id}).then((user) => {
          expect(user[0].tokens.length).toBe(0)
          done()
        }).catch((err) => done(err))

      })
  })
})



