/**
 * Created by ranaali on 4/24/17.
 */


const {MongoClient, ObjectID} = require('mongodb');  // object destructuring syntax

let obj = new ObjectID();
console.log('Manually created object id ', obj);

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {

  if (err) {
    return console.log('unable to connect mongodb server');
  }

  console.log('connected to mongodb server');

  //findOneAndUpdate | using $set update operator
  db.collection('Todo').findOneAndUpdate({
    _id: new ObjectID('58fdd113154fc5568e0ffb47'),
  },{
    $set: {
      completed: true,
    },

  },{
    returnOriginal: false,
  }).then((result) => {
    console.log(result);
  }).catch((err) => {
    console.log(err);
  });

  ////findOneAndUpdate | using $inc update operator
  db.collection('Users').findOneAndUpdate({
    _id: new ObjectID("58fdd318ab4b775743ba4474"),
  },{
    $inc: {
      age: 1,
    },

  },{
    returnOriginal: false,
  }).then((result) => {
    console.log(result);
  }).catch((err) => {
    console.log(err);
  });

  // db.close();
});