const mongoose = require('mongoose')
const validator = require('validator')
const jwt = require('jsonwebtoken')
const _ = require('lodash')
const bcrypt = require('bcryptjs')

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

// instance method
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

//model methods
UserSchema.statics.findByToken = function (token) {
  let User = this
  let decoded

  try {
    decoded = jwt.verify(token, 'somerandomstring')
  } catch (e) {
    return Promise.reject()
  }

  return User.findOne({
    '_id': decoded._id,
    'tokens.token': token,
    'tokens.access': 'auth',
  })
}

UserSchema.pre('save', function (next) {
  let user = this

  if (user.isModified('password')) {

    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(user.password, salt, (err, hash) => {
        user.password = hash
        next()
      })
    })



  } else {
    next()
  }

})

let User = mongoose.model('Users', UserSchema)
module.exports = {User}