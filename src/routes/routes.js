const indexController = require('../server-controllers/index-controller');

module.exports = function (router) {
    router.get('/', indexController.home);
    router.get('/dashboard', indexController.dashboard);
    
  };
  