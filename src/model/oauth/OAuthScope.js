/**
 * Created by Manjesh on 14-05-2016.
 */
'use strict';

const mongoose = require('mongoose'),
  Schema = mongoose.Schema;

const OAuthScopeSchema = new Schema({
  scope:  String,
  is_default: Boolean
});

module.exports = mongoose.model('OAuthScope', OAuthScopeSchema);
