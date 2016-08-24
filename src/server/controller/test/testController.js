//  const statusService = require('../../service/internal/statusService');

module.exports = (() => {
  function index(request, response) {
    response.send('dies ist ein test');
  }

  function getHTML(request, response) {
    response.render('testTemplate', {title: 'Kadse', h1: 'WURST'});
  }

  return {
    index,
    getHTML
  };
})();
