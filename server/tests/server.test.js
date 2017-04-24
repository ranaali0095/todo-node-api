const expect = require('expect');
const request = require('supertest');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');

const todos = [
  {
    text: 'First test todo',
  },
  {
    text: 'Second test todo',
  },
];

//remove all todos fetch from database
beforeEach((done) => {
  Todo.remove({}).then(() => {
    Todo.insertMany(todos);
  }).then(() => done());
});

describe('POST /todos', () => {

  it('should create a new todo', (done) => {
    let text = 'Test todo text';

    request(app).post('/todos').send({text}).expect(200).expect((res) => {

      expect(res.body.text).toBe(text);

    }).end((err, res) => {
      if (err) {
        return done(err);
      }
      Todo.find({text}).then((todos) => {
        expect(todos.length).toBe(1);
        expect(todos[0].text).toBe(text);
        done();
      }).catch((err) => done(err));
    });
  });

  it('should not create with invalid body data', (done) => {

    request(app).post('/todos').send({}).expect(400).end((err, res) => {
      if (err) {
        return done(err);
      }

      Todo.find().then((todos) => {
        expect(todos.length).toBe(2);
        done();
      }).catch((err) => done(e));

    });
  });
});

describe('GET /todos', () => {

  it('should get all the todos', (done) => {

    request(app).get('/todos').expect(200).expect((res) => {
      expect(res.body.todos.length).toBe(2);
    }).end(done);

  });

});