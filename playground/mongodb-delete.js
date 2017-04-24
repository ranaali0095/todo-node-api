/**
 * Created by ranaali on 4/24/17.
 */

const {MongoClient, ObjectID} = require('mongodb');  // object destructuring syntax

let obj = new ObjectID();
console.log('Manually created object id ', obj);

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {

  //deleteMany
  db.collection('Todo').deleteMany({text: 'text goes here'}).then((result) => {
    console.log(result);
  }).catch((err) => {
    console.log(err);
  });

  //deleteOne
  db.collection('Todo').deleteOne({text: 'text goes here'}).then((result) => {
    console.log(result);
  }).catch((err) => {
    console.log(err);
  });


  //findOneAndDelete | returns the deleted document
  db.collection('Todo').findOneAndDelete({completed: false})
  .then((result) => {
    console.log(result);
  }).catch((err) => {
    console.log(err);
  });



  // db.close();
});