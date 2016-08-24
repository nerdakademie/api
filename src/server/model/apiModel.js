const mongoose = require('mongoose');

const apiSchema = mongoose.Schema({
  user: {
    type: String,
    required: true
  },
  pass: {
    type: String,
    required: true
  },
  user_key: {
    type: String,
    required: true
  },
  typo_cookie: {
    type: String,
    required: false
  }

});

mongoose.model('Api', apiSchema);
