
'use strict';
const mongoose = require('mongoose'),
  Schema = mongoose.Schema;

const OAuthClientSchema = new Schema({
  id: String,
  name:  String,
  clientID:  String,
  clientSecret: String,
  trustedClient: Boolean,
});

mongoose.model('client', OAuthClientSchema);
