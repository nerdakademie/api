const config = require('config');
const scope = require('mongoose').model('scope');

module.exports = (() => {
  'use strict';

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

  return {
    createClient,
    scopes
  };
})();
