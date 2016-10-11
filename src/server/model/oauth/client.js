
'use strict';
const mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  autoIncrement = require('mongoose-auto-increment'),
  config = require('config');

autoIncrement.initialize(mongoose.createConnection(config.get('db-url')));
const OAuthClientSchema = new Schema({
  name:  String,
  appIcon: String,
  clientID:  String,
  clientSecret: String,
  redirectURI: String,
  description: String,
  contact: String,
  apiCalls: Number,
  apiLevel: Number,
  trustedClient: Boolean
});


/*
db.clients.insert({
 id: '0',
 name:  'TestApp',
 clientID:  'test',
 clientSecret: 'test',
 redirectURI: 'https://oauth2orizerecipes.herokuapp.com',
 description: 'hack',
 contact: 'localhost@localhost',
 trustedClient: false
 });

 */
OAuthClientSchema.plugin(autoIncrement.plugin, { model: 'client', field: 'id' });

mongoose.model('client', OAuthClientSchema);
