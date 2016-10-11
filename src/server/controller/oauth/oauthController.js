const config = require('config');
const scope = require('mongoose').model('scope');
const Client = require('mongoose').model('client');
const srs = require('secure-random-string');
module.exports = (() => {
  'use strict';

  //init multer for fileupload

  function createClient(req,res){
    res.render('registerClient', {
      title: 'Register Client',
      rootPath: config.rootPath,
    });
  }

  function scopes(req,res){
    let scopeObject ={};
    const scopeCursor = scope.find({}).cursor();

    scopeCursor.on('data', function(doc) {
      if(scopeObject[doc.category] === undefined){
        scopeObject[doc.category] = [];
      }

      scopeObject[doc.category].push({id: doc.id, name: doc.name, description: doc.description});

    });

    scopeCursor.on('end', function() {
      res.send(scopeObject);
    });

  }

  function insertClient(request, response){
    const client = new Client({
      name:  request.body.name,
      appIcon: 'https://api.nerdakademie.xyz/images/'+request.file.filename,
      clientID:  srs({length: 16}),
      clientSecret: srs({length: 32}),
      redirectURI: request.body.redirectURI,
      description: request.body.description,
      contact: request.body.contact,
      apiCalls: 0,
      apiLevel: 0,
      trustedClient: false
    });
    client.save((error) => {
      if(error){
        response.status(404).end();
      }else{
        response.status(200).json({clientID:client.clientID, clientSecret: client.clientSecret});
      }
    });
  }

  return {
    createClient,
    insertClient,
    scopes
  };
})();
