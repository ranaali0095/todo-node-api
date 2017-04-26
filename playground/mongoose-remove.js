const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/users');


// Remove all
Todo.remove({}).then((result) => {
   console.log(result);
});


// FindOneAndRemove | Return remove document
Todo.findOneAndRemove({_id: '58fe2e74dc91af75404ec0a7'}).then((todo) => {
    console.log(todo)
});

// FindByIdAndRemove | Return remove document
Todo.findByIdAndRemove('58fe2e74dc91af75404ec0a7').then((todo) => {
    console.log(todo);
});