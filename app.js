
/**
 * Module dependencies.
 */

var express = require('express')
	, mongoose = require('mongoose')
	, models = require('./models')
	, routes = require('./routes')
	, http = require('http')
	, path = require('path')
	, fs = require('fs')
	, url = require('url')
	, async = require('async')
	, crawl = require('./tt/tt_crawl.js')
	, parser = require('./parser.js')
	, config = require( './config.js')
	, tt_image = require('./tt/tt_image.js')
	, tt_utils = require('./tt/tt_utils.js')
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

var getAllSites = function (callback) {
	Site.find( {}, function (err, sites) {
		if (err) throw callback(err);
		// else callback( null, sites);
		else {
			sites.forEach( function(site){
				callback(null, site.url);
			});
		}
	});
};

var startCrawl = function () {
	async.waterfall([

		getAllSites,

		crawl.crawlSite,

		parser.parseHtmlForImages,

		function( imagesData, callback){
			imagesData.forEach( function(imageData ) {
				callback(null, imageData );	
			});
		},

		function( imageData, callback ) {
			app.ImageModel.exists( imageData.src, function(err, exists) {
				if ( err ) callback(err);
				else {
					if (!exists) callback(null, imageData);
					else callback("image exists already");
				}
			});
		},

		function(imageData,callback) {
				// image has width and height defined and it is bigger than the minimum
				if (typeof imageData.width !== "undefined" && typeof imageData.height !== "undefined" ) {
					if (imageData.width > config.image_min_width || imageData.height > config.image_min_width ) {

						// console.log("is big enough");
						tt_utils.downloadFileFromURL(imageData.src, function( err, filepath ){
							if (err) {
								console.log( "error downloading " + imageData.src);
								callback(err, null);
							}
							else {
								callback( null, imageData );
							}
						});
					} else {
						callback("not big enough");
					}
				} 
				else {
				// we need to download the image first and then check its size 
					// console.log("needs download");
					// callback("needs download"); //, imageData.src);				
					tt_utils.downloadFileFromURL(imageData.src, function( err, filepath ){
						if (err) {callback( err )}
						else {
							tt_image.getImageSize( filepath, function(err, size) {
								if (err) callback( err );
								else {
									if (size.width > config.image_min_width || size.height > config.image_min_width ) {
										imageData.width = size.width;
										imageData.height = size.height;
										callback( null, imageData );
									} else {
										fs.unlink(filepath, function (err) {
											if (err) callback(err, null);
											else callback('image too small, successfully deleted');
										});
									}
								};
							});
						}
					});
				}
		},

		saveImage,

		function (imageEntry, callback) {
			console.log( "sending to socket");
			now_socket.sendToClients( imageEntry );
			callback(null, imageEntry);
		}
		
	], function (err, success ) {
		console.log( "exited waterfall");
		console.log(err);
	});
}

var saveImage = function(imageData, callback ) {

	tt_image.makeThumbnail( path.basename(imageData.src), imageData, function(err, thumb_path, thumb_size ){
		if (err) {
			// console.log(err);
			callback(err, null);
		} else {

			var image = new app.ImageModel({

				name 		: path.basename( imageData.src ),

				url			: imageData.src,
				site 		: url.parse( imageData.src ).hostname.toString(),
				updated 	: new Date,
				width 		: imageData.width,
				height 		: imageData.height,

				thumb_name	: path.basename(thumb_path),
				thumb_width : thumb_size.width,
				thumb_height: thumb_size.height
			});

			image.save(function (err, imageEntry) {

				console.log( "saved image");
				if( err ) callback(err);
				else callback(null, imageEntry);
			});
		}
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


