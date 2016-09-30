'use strict';

const mongoose = require('mongoose'),
  Schema = mongoose.Schema;

const RefreshTokenSchema = new Schema({
  token: String,
  userID: String,
  clientID: String,
  scope: String,
});

mongoose.model('refreshToken', RefreshTokenSchema);
