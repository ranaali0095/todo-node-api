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

    db.collection('Todo').insertOne({
        text: 'Something to do',
        completed: false
    },(err, result)=> {

        if(err){
            return console.log('unable to connect mongodb server',err);
        }

        console.log(JSON.stringify(result.ops, undefined, 2));

    });

    db.collection('Users').insertOne({
        name: 'Rana Ali',
        age: 22,
        location: 'Pakistan'
    }, (err, result) => {
        if (err) {
            return console.log('unable to create new document');
        }

        console.log(JSON.stringify(result.ops, undefined, 2));
    });

    db.close();
});