
var gm = require('gm')
	, config = require( '../config.js')
	, tt_utils = require( './tt_utils.js');

function getImageSize( file_path, callback )
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

function makeThumbName( file_path )
{
	var name = path.basename( file_path );
	var file_ext = tt_utils.getExtension(name);
	return name.slice( 0, -(file_ext.length) ) + '.' + config.thumbs.ext + file_ext;
}

function makeThumbnail( file_path, original_size, callback)
{
    var thumb_path = path.join( __dirname, 'public', 'thumbs', makeThumbName(file_path) );

    // calculate proportions 
    // ---> currently fixed height
	if ( original_size.width >= original_size.height ){
		var thumb_width = config.thumbs.width;
		var thumb_height = Math.round( thumb_width * ( original_size.height / original_size.width ) );
	} else {
		var thumb_height = config.thumbs.height;
		var thumb_width = Math.round( thumb_height * ( original_size.width / original_size.height ) );
	}

	gm( file_path )
	.thumb( thumb_width, thumb_height, thumb_path, 90, function(err ){
		if (err) callback( err );
		else {
			// console.log( "this: " +  console.dir(this) );
			callback( null, thumb_path, { width:thumb_width, height:thumb_height } );
		}
	});
}

exports.getImageSize = getImageSize;
exports.makeThumbnail = makeThumbnail;
