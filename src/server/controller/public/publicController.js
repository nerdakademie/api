const config = require('config');
const debug = require('debug');

module.exports = (() => {
  function index(request, response) {
    const sess = request.session;
    if (sess.user == null) {
      response.render('loginForm', {
        title: 'KadseBot Login',
        rootPath: config.rootPath,
        user: sess.user
      });
    } else {
      response.render('index', {
        title: 'KadseBot',
        rootPath: config.rootPath
      });
    }
  }

  return {
    index
  };
})();
