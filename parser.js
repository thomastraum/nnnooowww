
var cheerio = require('cheerio')
	, url = require('url')
	, config = require('./config.js')
	, tt_image = require('./tt/tt_image.js')
	, path = require('path');

exports.parseHtmlForImages = function( _html, _callback ) 
{
	var $ = cheerio.load( _html ); 
	imgs = $('img').toArray();

	var imagedata = [];

	imgs.forEach( function( img ) {

		if ( img.attribs.src !== null 
			&& tt_image.hasImageExtension(img.attribs.src) ) {

			// console.log( "src: " + img.attribs.src );

			var image = {
				src : img.attribs.src.toString(),
				width : (typeof img.attribs.width !== "undefined") ? img.attribs.width : undefined,
				height : (typeof img.attribs.width !== "undefined") ? img.attribs.height : undefined,
			}

			imagedata.push(image);

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
				link = 'http://' + hostname + '/' + link;
				console.log( "no http:" + link );
				// has no #
			}

			if ( link.indexOf("#") == -1 ) {
				var full_link = link;
				if ( lookForDuplicate( full_link, valid_links ) != true ) {
					// console.log( hostname + link );
					valid_links.push( full_link );
				}
			}
			// }
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