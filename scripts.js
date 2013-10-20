var socket = io.connect('http://10.0.1.4:8080');

$(document).ready(function () {
	var element = $('.textDisplay');
	element.html('Welcome');
	socket.on('serialEvent', function (data) {
		element.html(data.value);
	});
});