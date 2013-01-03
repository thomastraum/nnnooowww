
var gm = require('gm')
	, path = require('path')
	, config = require( '../config.js')
	, tt_utils = require( './tt_utils.js');

function makeThumbName( file_path )
{
	var name = path.basename( file_path );
	var file_ext = tt_utils.getExtension(name);
	return name.slice( 0, -(file_ext.length) ) + '.' + config.thumbs.ext + file_ext;
}

exports.getImageSize = function( file_path, callback )
{
	// obtain the size of an image
	gm( file_path )
	.size(function (err, size) {
		if (err) callback( err );
		else {
			// console.log(size.width > size.height ? 'wider' : 'taller than you');
			callback( null, size );
		}
	});
}

exports.makeThumbnail = function ( file_path, original_size, callback)
{
    var thumb_path = path.join( __dirname, 'public', 'thumbs', makeThumbName(file_path) );
    var thumb_size = calculateThumbSize( original_size );

	gm( file_path )
	.thumb( thumb_size.width, thumb_size.height, thumb_path, 90, function(err ){
		if (err) callback( err );
		else {
			callback( null, thumb_path, { width:thumb_size.width, height:thumb_size.height } );
		}
	});
}

exports.calculateThumbSize = function( original_size, callback )
{
    // calculate proportions 
	if ( original_size.width >= original_size.height ){
		var thumb_width = config.thumbs.width;
		var thumb_height = Math.round( thumb_width * ( original_size.height / original_size.width ) );
	} else {
		var thumb_height = config.thumbs.height;
		var thumb_width = Math.round( thumb_height * ( original_size.width / original_size.height ) );
	}

	return {width: thumb_width, height: thumb_height };
}

exports.hasImageExtension = function( string )
{
	var imageExtensions = [
		'.jpg'
		, '.gif'
		, '.jpeg'
		, '.png'
	];

	var extension = path.extname( string );
	
	for (var i = imageExtensions.length - 1; i >= 0; i--) {
		if (imageExtensions[i] == extension) {
			return true;
		};
	};

	return false;
}