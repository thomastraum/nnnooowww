
//------------------------------------------------------
var socket = io.connect('http://localhost');

//----------------------------------------------------- TEST
socket.on('news', function (data) {
	console.log(data);
	socket.emit('my other event', { my: 'data' });
});

//----------------------------------------------------- NEW IMAGE
socket.on( 'newImageEvent', function( imageData ){
	$(document).trigger( "socketNewImageEvent",  imageData);
	// console.log("newImageEvent");
});