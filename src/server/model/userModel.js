const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  user: {
    type: String,
    required: true
  },
  pass: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: false
  },
  surname: {
    type: String,
    required: false
  },
  centuria: {
    type: String,
    required: false
  },
  api_key: {
    type: String,
    required: false
  },
  typo_cookie_val: {
    type: String,
    required: false
  },
  typo_cookie_timestamp: {
    type: String,
    required: false
  }
});

mongoose.model('User', userSchema);
