
/**
 * Module dependencies.
 */

var express = require('express')
	, routes = require('./routes')
	, http = require('http')
	, path = require('path');

var app = express();

app.configure(function(){
	app.set('port', process.env.PORT || 3000);
	app.set('views', __dirname + '/views');
	app.set('view engine', 'jade');
	app.use(express.favicon());
	app.use(express.logger('dev'));
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(app.router);
	app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler());
  // app.set('db-uri', 'mongodb://localhost/nowdev');
});

//--------------------------------------------------------------- ROUTES
app.get('/', routes.index);
app.get( '/sites', routes.sites);
app.get( '/sites/add', routes.sitesAddGet);

app.post( '/sites/add', routes.sitesAddPost);
app.delete( '/sites/:id', routes.sitesDeleteSite );

//--------------------------------------------------------------- Server
http.createServer(app).listen(app.get('port'), function(){
	console.log("Express server listening on port " + app.get('port'));
});