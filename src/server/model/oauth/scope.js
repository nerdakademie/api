
'use strict';

const mongoose = require('mongoose'),
  Schema = mongoose.Schema;

const OAuthScopeSchema = new Schema({
  id: String,
  name:  String,
  category: String,
  description: String,

});

mongoose.model('scope', OAuthScopeSchema);
