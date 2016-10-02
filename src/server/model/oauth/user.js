'use strict';

const mongoose = require('mongoose'),
      Schema = mongoose.Schema,
      autoIncrement = require('mongoose-auto-increment'),
      config = require('config');

autoIncrement.initialize(mongoose.createConnection(config.get('db-url')));

const UserSchema = new Schema({
  username:  String,
  password:  String,
  nak_cookie: String

});
UserSchema.plugin(autoIncrement.plugin, { model: 'user', field: 'id' });
mongoose.model('user', UserSchema);
