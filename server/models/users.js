let mongoose = require('mongoose');

let User = mongoose.model('Users', {
  email: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
  },
});

module.exports = {User};