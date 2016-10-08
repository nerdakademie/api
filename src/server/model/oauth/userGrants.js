'use strict';

const mongoose = require('mongoose'),
  Schema = mongoose.Schema;

const UserGrantSchema = new Schema({
  userID: Number,
  clientID: Number,
  scope: [String],
});

mongoose.model('userGrant', UserGrantSchema);
