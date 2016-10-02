
'use strict';

const mongoose = require('mongoose'),
  Schema = mongoose.Schema;

const OAuthAuthorizationCodeSchema = new Schema({
  authorization_code: String,
  redirect_uri:  String,
  scope:  [String],
  userID: Number,
  clientID: Number,
});

mongoose.model('authorizationCode', OAuthAuthorizationCodeSchema);
