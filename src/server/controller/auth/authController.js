const config = require('config');
module.exports = (() => {
  'use strict';
  function login(req,res){
    const sess = req.session;
    console.log(req.session.returnTo);
    res.render('loginForm', {
      title: 'Nerdakademie Login',
      returnTo: req.session.returnTo,
      rootPath: config.rootPath,
      user: sess.user
    });
  }

  return {
    login
  };
})();
