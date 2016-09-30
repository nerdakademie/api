/**
 * Created by Manjesh on 14-05-2016.
 */

'use strict';

const mongoose = require('mongoose'),
  Schema = mongoose.Schema;

const OAuthAccessTokenSchema = new Schema({
  token: String,
  userID:  String,
  expirationDate: Date,
  clientID: String,
  scope:  String,
});

mongoose.model('accessToken', OAuthAccessTokenSchema);
