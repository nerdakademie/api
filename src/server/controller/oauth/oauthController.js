const config = require('config');
module.exports = (() => {
  'use strict';

  function createClient(req,res){
    res.render('registerClient', {
      title: 'Register Client',
      rootPath: config.rootPath,
    });
  }

  return {
    createClient
  };
})();
