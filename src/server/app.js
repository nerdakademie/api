const config = require('config');
const bodyParser = require('body-parser');
const express = require('express');
const passport = require('passport');
const compression = require('compression');
const consolidate = require('consolidate');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoStore = require('express-session-mongo');
const argv = require('minimist')(process.argv.slice(2));
const swagger = require('swagger-node-express');
const path = require('path');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const webpackClientDevConfig = require('../../resources/client/webpack/webpack-client-dev.config.js');

const app = express();

app.disable('x-powered-by');

app.locals.pretty = true;

app.locals.cache = 'memory';

app.use(compression({level: 9}));

app.engine('html', consolidate.swig);
app.set('views', `${__dirname}/../../resources/server/view`);
app.set('view engine', 'html');

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(session({
  secret: 'Kadse SECRET',
  store: new MongoStore({ip: '127.0.0.1', port: '27017', db: 'api', collection: 'sessions'})
}));
app.use(passport.initialize());
app.use(passport.session());


webpackClientDevConfig.output.publicPath = config.rootPath;
const compiler = webpack(webpackClientDevConfig);
const publicWebpackDevMiddleware = webpackDevMiddleware(compiler, {
  publicPath: webpackClientDevConfig.output.publicPath,
  stats: {
    colors: true,
    chunks: false
  }
});

app.use(publicWebpackDevMiddleware);
app.use(webpackHotMiddleware(compiler));





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
require('./model/oauth/index');
// Passport configuration
require('./helper/passport');

// Swagger redirect
//app.use(config.rootPath, express.static('swagger'));
app.use(config.rootPath, require('./routes/public/publicRoutes'));
app.use(`${config.rootPath}/test`, require('./routes/test/testRoutes'));
app.use(`${config.rootPath}/v1`, require('./routes/apiRoutes'));
app.use(`${config.rootPath}/oauth`, require('./routes/oauth/oauthRoutes'));
app.use(`${config.rootPath}/auth`, require('./routes/auth/authRoutes'));
app.use(require('./routes/errorRoutes'));

module.exports = app;
