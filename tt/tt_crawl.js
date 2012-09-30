
var http = require('http')
	, path = require('path')
	, url = require( 'url' )
	, config = require( '../config.js')
	, parser = require( '../parser.js');

// array holding all sites //
var sites = [];

var downloadPage = function ( _site, callback)
{

	console.log ( 'downloading: ', _site );
	// console.log( "url_parsed.path ", url_parsed.path );
	// console.log( "url_parsed.host ", url_parsed.host );

	var request = http.get(_site, function(res){

		var html = '';

	    res.on('data', function(chunk){
	        html += chunk;
	    })

	    res.on('end', function(e){
	    	setTimeout( 
	    		function() {
	    			callback( null, html );
	    		}
	    		, config.timeout 
	    	);
	    })

	}).on('error', function(e) {
		console.error( e.message, " ", url ); // callback( e.message, null, _site);
	});

}

exports.crawlSite = function ( _site, _depth, _callback ) 
{
	var max_depth = 2;

	// save site
	var site = { hostname: url.parse(_site).hostname, url : _site, depth : 0 };
	sites.push( site );

	// download the 1st page //
	downloadPage( site.url, function ( err, _html ) {
		loop( _html, site.url, function( err, html ){
			_callback( null, html);
		} );
	});
};

var loop = function( _html, _url, _callback)
{
	// console.log( "looping" );

	// call to save images 
	_callback( null, _html );

	// start loop
	sites.forEach( function(site) {

		var current_host = url.parse(_url).hostname;

		if ( current_host == site.hostname ) {
			site.depth = site.depth+1;
			if ( site.depth < 2 ) {
				crawlPage( _html, _url, function( err, _html ) {
					loop( _html, _url, _callback );
				});
			}
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

