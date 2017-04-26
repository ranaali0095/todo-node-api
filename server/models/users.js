const mongoose = require('mongoose')
const validator = require('validator')
const jwt = require('jsonwebtoken')
const _ = require('lodash')

let UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    unique: true,
    validate: [
      {
        validator: value => validator.isEmail(value),
        msg: 'Invalid email.',
      }],
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  tokens: [
    {
      access: {
        type: String,
        required: true,
      },
      token: {
        type: String,
        required: true,
      },
    }],
})

UserSchema.methods.toJSON = function () {
  let user = this
  let userObject = user.toObject()

  return _.pick(userObject, ['_id', 'email'])
}

UserSchema.methods.generateAuthToken = function () {
  let user = this
  let access = 'auth'
  let token = jwt.sign({_id: user._id.toHexString(), access}, 'somerandomtext')

  user.tokens.push({access, token})

  return user.save().then(() => {
    return token
  })
}

let User = mongoose.model('Users', UserSchema)
module.exports = {User}