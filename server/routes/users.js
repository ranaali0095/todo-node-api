let express = require('express');
let router = express.Router();
const _ = require('lodash');

//load custom modules

let {User} = require('./../models/users');
let {authenticate} = require('./../middlewares/authenticate');

router.post('/', (req, res) => {

    let body = _.pick(req.body,
        ['email', 'password']);
    let user = new User(body);
    user.save().then(() => {
        return user.generateAuthToken();  //call an  instance method
    }).then((token) => {
        res.header('x-auth', token).send(user);
    }).catch((err) => {
        res.status(400).send(err);
    });
});

router.get('/me', authenticate, (req, res) => {
    res.send(req.user);
});

router.post('/login', (req, res) => {

    let body = _.pick(req.body, ['email', 'password']);

    User.findByCredentials(body.email, body.password).then((user) => {
        user.generateAuthToken().then((token) => {
            res.header('x-auth', token).send(user);
        });
    }).catch((err) => {
        res.status(400).send();
    });
});

router.delete('/me/token', authenticate, (req, res) => {
    req.user.removeToken(req.token).then((user) => {
        res.status(200).send(user);
    }).catch((e) => {
        res.status(400).send();
    });
});

module.exports = router;