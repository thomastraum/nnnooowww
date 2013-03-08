var url = require( 'url' )
	, path = require( 'path' )
	, http = require('http')
	, fs = require('fs');

exports.getExtension = function(filename) 
{
    var i = filename.lastIndexOf('.');
    return (i < 0) ? '' : filename.substr(i);
};

exports.downloadFileFromURL = function( file_url, callback ) 
{
	var url_parsed = url.parse( encodeURI(file_url) ); 

	var options = {
	    host: url_parsed.host
	  , port: 80
	  , path: url_parsed.path
	}

	var file_name = path.basename(file_url);
	var file_extension = this.getExtension( file_name );
	// make sure there is nothing after the file extension /// 
	if ( file_extension.length > 5 ) {

		if ( file_extension.toLowerCase().substring(0,5) == ".jpeg" ) {
			file_name = file_name.slice(0, -(file_extension.length - 5));
		} else {
			file_name = file_name.slice(0, -(file_extension.length - 4));
		}
	}

    var file_path = path.resolve( __dirname, '../', 'public', 'images', file_name );
    // console.log( "file_path", file_path);

	var request = http.get( options , function(res){

		var imagedata = ''
		res.setEncoding('binary')

		if (res.statusCode == '404') {
			callback( 'file not found' +  file_url );
			return;
		} 
		res.on('data', function(chunk){
		    imagedata += chunk;
		})

		res.on('end', function(){

		    fs.writeFile( file_path, imagedata, 'binary', function(err){
		        if (err) callback( err );
		        else {
		    		callback( null, file_path );
		    	}
		    })
		})

	}).on('error', function(e) {
		console.log("http.get: " + e.message);
		callback( e );
	});
};