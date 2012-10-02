
//--------------------------------------------------------------- Sockets
var io;

exports.startSocket = function ( _server )
{
	io = require('socket.io').listen(_server);
	initOnConnection();

	return io;
}

var initOnConnection = function ()
{
	io.sockets.on('connection', function (socket) {
		socket.emit('news', { hello: 'world' });
			socket.on('my other event', function (data) {
			console.log(data);
		});
	});
}

exports.sendToClients = function  ( imageData ) {
	
	io.sockets.emit('newImageEvent', { new_image: imageData});
	
}