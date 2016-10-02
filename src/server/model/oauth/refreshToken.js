'use strict';

const mongoose = require('mongoose'),
  Schema = mongoose.Schema;

const RefreshTokenSchema = new Schema({
  token: String,
  userID: Number,
  clientID: Number,
  scope: [String],
});

mongoose.model('refreshToken', RefreshTokenSchema);
