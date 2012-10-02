var cheerio = require('cheerio')
	, url = require('url')
	, config = require('./config.js');

exports.parseHtmlForImages = function( _html, _callback ) 
{
	var $ = cheerio.load( _html ); 
	imgs = $('img').toArray();

	var imagedata = [];

	imgs.forEach( function( img ) {

		if ( img.attribs.src == null ) {
			console.log( "img is null" );
			return;
		}
		
	    if ( img.attribs.width > config.image_min_width 
	    		|| img.attribs.height > config.image_min_height ) {

		    var img_url = img.attribs.src.toString();
		    var img_width = img.attribs.width;
		    var img_height = img.attribs.height;

		    imagedata.push({ src:img_url, width: img_width, height: img_height });
	    } 

	});

	_callback( null, imagedata );	
}

exports.parseHtmlForLinks = function( _html, _site, _callback ) 
{
	var hostname = url.parse( _site ).hostname.toString();
	var valid_links = [];

	var $ = cheerio.load( _html ); 
	var anchors = $('a').toArray();

	anchors.forEach( function ( _anchor ) {

		if ( _anchor.attribs.href != undefined ) {
			var link = 	_anchor.attribs.href;

			if( link.substr( 0, 4) !== 'http') {
				// has no #
				if ( link.indexOf("#") == -1 ) {
					if ( lookForDuplicate( "http://" + hostname + link, valid_links ) != true ) {
						// console.log( hostname + link );
						// 
						valid_links.push( "http://" + hostname + link );
					}
				}
			}
		}
	});

	_callback( null, valid_links );
}

var lookForDuplicate = function ( _string, _array ) {

	for (var i = _array.length - 1; i >= 0; i--) {
		if ( _array[i] == _string ) {
			return true
			break;
		}	
	};
	return false;
}








