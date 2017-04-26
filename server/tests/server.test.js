const expect = require('expect');
const request = require('supertest');
const {ObjectId} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');

const todos = [
    {
        _id: new ObjectId(),
        text: 'First test todo',
    },
    {
        id: new ObjectId(),
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
                expect(todos[ 0 ].text).toBe(text);
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
            }).catch((err) => done(err));

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

describe('GET /todos/:id', () => {

    it('should retunn the todo', (done) => {
        request(app).
            get(`/todos/${todos[ 0 ]._id.toHexString()}`).
            expect(200).expect((res) => {
                expect(res.body.todo.text).toBe(todos[ 0 ].text);
            }).
            end(done);
    });

    it('should return 404 if todo not found', (done) => {
        request(app).
            get(`/todos/${(new ObjectId).toHexString}`).
            expect(404).
            end(done);
    });

    it('should return non-object ids', (done) => {
        request(app).get('todos/1234').expect(404).end(done);
    });

});


