/**
 * Created by Manjesh on 14-05-2016.
 */

'use strict';

const mongoose = require('mongoose'),
  Schema = mongoose.Schema;

const OAuthAccessTokenSchema = new Schema({
  token: String,
  userID:  Number,
  expirationDate: Date,
  clientID: Number,
  scope:  [String],
});

mongoose.model('accessToken', OAuthAccessTokenSchema);
