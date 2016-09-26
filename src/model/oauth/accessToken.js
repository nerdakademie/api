/**
 * Created by Manjesh on 14-05-2016.
 */

'use strict';

const mongoose = require('mongoose'),
  Schema = mongoose.Schema;

const OAuthAccessTokenSchema = new Schema({
  access_token: String,
  expires: Date,
  scope:  String,
  user:  { type : Schema.Types.ObjectId, ref: 'User' },
  client: { type : Schema.Types.ObjectId, ref: 'OAuthClient' },
});

module.exports = mongoose.model('OAuthAccessToken', OAuthAccessTokenSchema);
