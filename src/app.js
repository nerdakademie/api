const config = require('config');
const bodyParser = require('body-parser');
const express = require('express');
const compression = require('compression');
const consolidate = require('consolidate');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoStore = require('express-session-mongo');
const argv = require('minimist')(process.argv.slice(2));
const swagger = require('swagger-node-express');
const path = require('path');
const oauthserver =  require('oauth2-server');
const authenticate = require('./helper/oauth/authenticate');

const app = express();

app.disable('x-powered-by');

app.locals.pretty = true;

app.locals.cache = 'memory';

app.use(compression({level: 9}));

app.engine('html', consolidate.swig);
app.set('views', `${__dirname}/../../resources/view`);
app.set('view engine', 'html');

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(session({
  secret: 'Kadse SECRET',
  store: new MongoStore({ip: '127.0.0.1', port: '27017', db: 'kadse', collection: 'sessions'})
}));


// Swagger configuration
const subPath = express();
app.use('/v1', subPath);
swagger.setAppHandler(subPath);
swagger.setApiInfo({
  title: 'Nerdakademie API',
  description: 'API to do something, manage something...',
  termsOfServiceUrl: '',
  contact: '',
  license: 'MIT',
  licenseUrl: ''
});
swagger.configureSwaggerPaths('', 'api-docs', '');
swagger.configure('https://api.nerdakademie.xyz/v1', '1.0.0');

require('mongoose').connect(config.get('db-url'));
require('./model/statisticModel');
require('./model/apiModel');

//OAUTH
require('./helper/oauth')(app)
//require('./helper/oauth/seed');

// Swagger redirect
app.use(config.rootPath, express.static('swagger'));
app.use(`${config.rootPath}/test`, require('./routes/test/testRoutes'));
app.use(`${config.rootPath}/v1`, require('./routes/apiRoutes'));
app.use(require('./routes/errorRoutes'));

module.exports = app;
