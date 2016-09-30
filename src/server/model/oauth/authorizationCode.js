
'use strict';

const mongoose = require('mongoose'),
  Schema = mongoose.Schema;

const OAuthAuthorizationCodeSchema = new Schema({
  authorization_code: String,
  redirect_uri:  String,
  scope:  String,
  userID: String,
  clientID: String,
});

mongoose.model('authorizationCode', OAuthAuthorizationCodeSchema);
