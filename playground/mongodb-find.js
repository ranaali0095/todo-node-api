/**
 * Created by ranaali on 4/24/17.
 */

// const MongoClient = require('mongodb').MongoClient;

const {MongoClient, ObjectID} = require('mongodb');  // object destructuring syntax

let obj = new ObjectID();
console.log('Manually created object id ',obj);

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db)=> {

    if(err){
        return console.log('unable to connect mongodb server');
    }

    console.log('connected to mongodb server');


    // db.collection('Todo').find({_id: new ObjectID("58fdd113154fc5568e0ffb47")}).toArray().then((docs) => {
    //
    //   console.log(JSON.stringify(docs,undefined,2));
    // }).catch((err) => {
    //   console.log('unable to fetch records ', err );
    // });


  db.collection('Todo').find().count().then((count) => {

    console.log(count);
  }).catch((err) => {
    console.log('unable to fetch records ', err );
  });
    // db.close();
});