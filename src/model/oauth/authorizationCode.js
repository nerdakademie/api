/**
 * Created by Manjesh on 14-05-2016.
 */

'use strict';

const mongoose = require('mongoose'),
  Schema = mongoose.Schema;

const OAuthAuthorizationCodeSchema = new Schema({
  authorization_code: String,
  redirect_uri:  String,
  scope:  String,
  user:  { type : Schema.Types.ObjectId, ref: 'User' },
  client: { type : Schema.Types.ObjectId, ref: 'OAuthClient' },
});

module.exports = mongoose.model('OAuthAuthorizationCode', OAuthAuthorizationCodeSchema);
