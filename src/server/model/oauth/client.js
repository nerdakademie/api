
'use strict';
const mongoose = require('mongoose'),
  Schema = mongoose.Schema;

const OAuthClientSchema = new Schema({
  id: String,
  name:  String,
  clientID:  String,
  clientSecret: String,
  trustedClient: Boolean
});


/*
db.client.insert({
 id: '0',
 name:  'TestApp',
 clientID:  'test',
 clientSecret: 'test',
 trustedClient: false
 });

 */

mongoose.model('client', OAuthClientSchema);
