'use strict';

const mongoose = require('mongoose'),
  Schema = mongoose.Schema;

const UserSchema = new Schema({
  userID: String,
  username:  String,
  password:  String,
  name: String,
});

mongoose.model('user', UserSchema);
