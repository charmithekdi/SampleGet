const indexController = require('../server-controllers/index-controller');

module.exports = function (router) {
    router.get('/', indexController.home);
    router.get('/raw', indexController.getRawData);
    router.get('/raw', indexController.getRawData);
  };
  