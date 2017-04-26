const jwt = require('jsonwebtoken')

var data = {
  id: 10,
  name: 'rana ali',
  age: 22
}

let token = jwt.sign(data, 'somerandomstring')
console.log(token)

let decoded = jwt.verify(token, 'somerandomstring')
console.log('decoded  ', decoded)