/**
 * Created by Manjesh on 14-05-2016.
   scope: String
 */
'use strict';

const mongoose = require('mongoose'),
  Schema = mongoose.Schema;

const UserSchema = new Schema({
  username:  String,
  password:  String
});

module.exports = mongoose.model('OAuthUser', UserSchema);
