/**
 * Created by Manjesh on 14-05-2016.
 */
'use strict';
const mongoose = require('mongoose'),
  Schema = mongoose.Schema;

const OAuthClientSchema = new Schema({
  name:  String,
  client_id:  String,
  client_secret: String,
  trustedClient: Boolean,
  user:  { type : Schema.Types.ObjectId, ref: 'User' },
});

module.exports = mongoose.model('OAuthClient', OAuthClientSchema);
