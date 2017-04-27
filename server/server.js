//load environment
require('./config/config');

require('./db/mongoose');

//load npm modules

const express = require('express');
const bodyParser = require('body-parser');

let app = express();
let port = process.env.PORT || 3000;

//load routes
let todo = require('./routes/todos');
let user = require('./routes/users');

app.use(bodyParser.json());

//routes

app.use('/todos',todo);
app.use('/users',user);


// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//     var err = new Error('Not Found');
//     err.status = 404;
//     next(err);
// });


//start server
app.listen(port, () => {
    console.log('Started on port ', port);
});

module.exports = {app};