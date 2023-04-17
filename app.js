// importing modules
const express = require('express');
//const exphbs = require('express-handlebars');
//const forceSSL = require('express-force-ssl');
const path = require('path');
const morgan = require('morgan');
const bodyParser = require('body-parser');
//const compression = require('compression');
//const favicon = require('serve-favicon');
//const helmet = require('helmet');
//const events = require('events');



// Importing the express module under the `app` variable
const app = express();

/* If the user is local development import the .env file, else do not load the
.env file. Also if production is set start newrelic for monitoring*/
if (app.get('env') === 'development') {
  /* eslint-disable global-require */
  require('dotenv').config();
} else {
  console.log('Please set your NODE_ENV to either `development` or `production`');
}


//app.use(helmet());
// Importing the favicon, remove if you do not have one.
// Added further layer of security

/* Once a brwoser receives the HSTS header (Strict Transport Security Header)
  that browser will prevent any communications from being sent over HTTP and will
  instead send all communications over HTTPS for a specificied amount of time.
The 'maxAge' parameter specified how many seconds after the first comm to use
  HTTPS in seconds, therefore 5184000s represents 60 days.
*/
/*
app.use(helmet.hsts({
  maxAge: 31536000 ,
  //includeSubDomains:false,
 preload:true  
}));
app.use(helmet.noCache());
*/

// Configure the express app
app.use(morgan('combined'));
app.use(bodyParser.json());

// app.use(bodyParser.urlencoded({
//   limit :'300mb',extended: false
// }));
//* ***************Check db Connection */

// Importing all routes to the server

const router = express.Router();
require('./src/routes/routes')(router);
app.use('/', router);
//auth.authenticate(app);


// view engine setup and public static directory
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({
  defaultLayout: 'main',
  helpers: require('./src/public/client-controllers/helpers/handlebars').helpers,
}));
app.set('view engine', 'handlebars');
// Load authenticated routes

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Page Not Found');
  err.status = 404;
  next(err);
});
// development error handler will print stck trace
// To run in development mode set config var NODE_ENV to 'development'
if (app.get('env') === 'development') {
  app.use((err, req, res) => {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err,
    });
  });
}

// Error Handler
app.use((err, req, res, next) => {
  console.log(`Status: ${err.status} - Message: ${err.message}`);
  console.log(err.stack);
  console.log('User Redirected to HomePage ');
 
});

module.exports = app;
