/*
* =====================================================
* Intialization
* =====================================================
*/
var fs 			= 	require('fs');
var path 		= 	require('path');
var express 	= 	require('express');
var bodyParser 	= 	require('body-parser');
var logger 		= 	require('morgan');
var router 		= 	express.Router();
var app 		=	express();
var mongodb 	= 	require('mongodb');
var mongoose    = 	require('mongoose');
var config 		= 	require('./src/server/config')
/*
* =====================================================
* Middleware Configuration
* =====================================================
*/
app.use(express.static(__dirname + '/build')); // set path for index 
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(logger('dev'));
router.use(logger());
// no cache on all requests:
app.use(function (req, res, next) {
  res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
  res.header('Expires', '-1');
  res.header('Pragma', 'no-cache');
  res.header('Cache-Control', 'no-cache');
  next();
});

/*
* =====================================================
* Router Links
* =====================================================
*/
var routes 		= 	require('./src/server/routes/index');
/*
* =====================================================
* Router Setting
* =====================================================
*/
app.use('/api/', routes);
/*
* =====================================================
* Server starter
* =====================================================
*/
app.set('port', (process.env.PORT || 3131));
app.listen(app.get('port'), function() {
  console.log('Server started: http://localhost:' + app.get('port') + '/');
});
