const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/users');

let todoId = '58fe2e74dc91af75404ec0a7';
let userId = '58fe0fb1be81ec69be8b2e99';

if (!ObjectID.isValid(todoId)) {
  console.log('Id is not valid');
}

Todo.find({
  _id: todoId,
}).then((todos) => {
  console.log('Todos ', todos);
});

//FindOne | find first and return
Todo.findOne({
  _id: todoId,
}).then((todo) => {
  console.log('Todos ', todo);
});

//FindById
Todo.findById(todoId).then((todo) => {
  if (!todo) {
    return console.log('Id not found');
  }
  console.log('Todos ', todo);
}).catch((e) => {
  console.log(e);
});

User.findById(userId).then((user) => {
  if (!user) {
    console.log('user with this id does not exist');
  }
  console.log('User: ', user);
}).catch((e) => {
  console.log(e);
});

