
'use strict';

const mongoose = require('mongoose'),
  Schema = mongoose.Schema;

const OAuthScopeSchema = new Schema({
  scope:  String,
  is_default: Boolean
});

mongoose.model('OAuthScope', OAuthScopeSchema);
