console.log('...');

var koast = require('koast');
koast.setConfigDirectory('mock-server/config');
koast.setEnvironment(process.env.NODE_ENV || 'local');

var appConfig = koast.getConfig('app');
var log = koast.getLogger();

koast.createDatabaseConnections()
  .then(function (connection) {
    var portNumber = Number(process.env.PORT || appConfig.portNumber);
    var app = koast.makeExpressApp(appConfig);
    app.listen(portNumber);
    log.info('Listening on ', portNumber);
  })
  .fail(function (error) {
    console.error('Error:', error);
    if (error.stack) {
      console.error(error.stack);
    }
  });