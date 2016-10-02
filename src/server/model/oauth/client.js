
'use strict';
const mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  autoIncrement = require('mongoose-auto-increment'),
  config = require('config');

autoIncrement.initialize(mongoose.createConnection(config.get('db-url')));
const OAuthClientSchema = new Schema({
  name:  String,
  clientID:  String,
  clientSecret: String,
  description: String,
  contact: String,
  trustedClient: Boolean
});


/*
db.clients.insert({
 id: '0',
 name:  'TestApp',
 clientID:  'test',
 clientSecret: 'test',
 trustedClient: false
 });

 */
OAuthClientSchema.plugin(autoIncrement.plugin, { model: 'client', field: 'id' });

mongoose.model('client', OAuthClientSchema);
