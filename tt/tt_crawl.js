
var http = require('http')
	, request = require('request')
	, path = require('path')
	, url = require( 'url' )
	, config = require( '../config.js')
	, parser = require( '../parser.js');

// array holding all sites //
var sites = [];

var downloadPage = function ( _site, callback)
{
	console.log ( 'downloading: ', _site );

	request( _site, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			callback( null, body );
		} else if( error ) {
			callback(error, null);
		} else {
			callback(response.statusCode, null);
		}
	});
}

exports.crawlSite = function ( _site, _callback ) 
{
	var max_depth = 2;

	// save site
	var site = { hostname: url.parse(_site).hostname, url : _site, depth : 0 };
	sites.push( site );

	console.log( "site: ", site );

	// download the 1st page //
	downloadPage( site.url, function ( err, _html ) {
		loop( _html, site.url, function( err, html ){
			_callback( null, html, site.url);
		});
	});
};

var loop = function( _html, _url, _callback)
{
	console.log( "looping", _url );

	// call to save images 
	_callback( null, _html );

	// start loop
	sites.forEach( function(site) {

		var current_host = url.parse(_url).hostname;

		if ( current_host == site.hostname ) {
			site.depth = site.depth+1;
			if ( site.depth < 2 ) {
				crawlPage( _html, _url, function( err, _html ) {
					if (err) loop( err, "", _callback);
					else loop( _html, _url, _callback );
				});
			}
		} else {
			console.log( "not same host: " + current_host + " " + site.hostname );
		}
	});
};


var crawlPage = function( _html, _site, _callback )
{
	parser.parseHtmlForLinks( _html, _site, function( err, links ) {

		if ( err ) throw err;
		else {
			links.forEach( function ( _link ) {
				downloadPage( _link, function( err, _html ){
					_callback( err, _html );
				} );
			});
		}
	});
}

