
/**
 * Module dependencies.
 */

var express = require('express')
	, mongoose = require('mongoose')
	, models = require('./models')
	, routes = require('./routes')
	, http = require('http')
	, path = require('path')
	, crawl = require('./tt/tt_crawl.js')
	, parser = require('./parser.js')
	, config = require( './config.js')
	, tt_image = require('./tt/tt_image.js')
	, now_socket = require('./now_socket.js')
	, Site
	, ImageModel
	, schedule = require('node-schedule');
	// , schedule = require('./schedule.js');

// this make app global and we can access global settings everywhere //
app = express();

app.configure(function(){
	app.set('port', process.env.PORT || 3000);
	app.set('views', __dirname + '/views');
	app.set('view engine', 'jade');

	app.set( 'Site', '');
	app.set( 'ImageModel', '');

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

//--------------------------------------------------------------- MODELS
models.defineModels( mongoose, function() {

	app.Site = Site = mongoose.model('Site');
	app.ImageModel = ImageModel = mongoose.model('ImageModel');
	mongoose.connect('mongodb://localhost/nowdev');

});

//--------------------------------------------------------------- ROUTES
app.get('/', routes.index);
app.get( '/sites', routes.sites);
app.get( '/sites/add', routes.sitesAddGet);

app.post( '/sites/add', routes.sitesAddPost);
app.delete( '/sites/:id', routes.sitesDeleteSite );

//--------------------------------------------------------------- CRAWLING
var startCrawl = function () 
{
	Site.find({}).exec( function (err, sites) {

		// console.log( "sites.length " + sites.length );

		if (err) throw err;
		sites.forEach( function(site){

			crawl.crawlSite( site.url, 0, function( err, html, site) {

				if (err) throw err;
				parser.parseHtmlForImages( html, function(err, imagesData) {

					if (err) throw err; //console.log(err);
					else { 
						imagesData.forEach( function(imageData) {

							var thumb_size = tt_image.calculateThumbSize( { width: imageData.width, height:imageData.height } );

							var image = new app.ImageModel({
								url		:imageData.src,
								updated : new Date,
								width 	: imageData.width,
								height 	: imageData.height,
								thumb_width : thumb_size.width,
								thumb_height : thumb_size.height
							});

							image.save(function (err, imageEntry) {
								if( err ) {
									// console.log("old"); 
								} else {
									console.log( "new" ); //imageEntry );
									now_socket.sendToClients( imageEntry );
								}
							});
						});
					}
				});
			});

		});


	});
}

startCrawl();

//--------------------------------------------------------------- SCHEDULE
var rule = new schedule.RecurrenceRule();
rule.hour = null;
rule.minute = 20;
rule.seconds = 0;

var j = schedule.scheduleJob( rule, function(){	
	console.log("schedule");
	startCrawl();
});

//--------------------------------------------------------------- Server

var server = require('http').createServer(app);
server.listen(app.get('port'), function(){
	console.log("Express server listening on port " + app.get('port'));
});

//--------------------------------------------------------------- Start Socket
var io = now_socket.startSocket( server );


