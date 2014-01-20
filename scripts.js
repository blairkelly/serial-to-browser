var locationhostname = window.location.hostname;
var serverip = locationhostname;
var locationport = window.location.port;
var serverport = locationport;
var socket = io.connect('//'+serverip+':'+serverport);
//var socket = io.connect('http://localhost:8080');

var recording = $('.recording');

$(document).ready(function () {
	var hrdisplay = $('.textdisplay');
	hrdisplay.css('height', hrdisplay.height() + 'px');
	//element.html('Welcome');
	socket.on('serialEvent', function (data) {
		var n = data.value.split("&");
		var params = {};
		for(var i = 0; i<n.length; i++) {
			params[n[i].substring(0, 1)] = n[i].substring(1, n[i].length);
		}
		if(params.h) {
			hrdisplay.prepend('<span>' + params.h + ' .&nbsp;</span>');
			var newestHR = hrdisplay.find('span:first-child');
			var nhr_ml = newestHR.width() * -1;
			newestHR.css('margin-left', nhr_ml + 'px');
			var hr_diff = params.h - 80;
			var rgbval = 255;
			if(hr_diff > 0) {
				hr_diff = hr_diff / 90;
				rgbval = 255 - (190 * hr_diff);
				if(rgbval < 65) {
					rgbval = 65;
				}
			}
			var thecolor = 'rgba(255,'+rgbval+','+rgbval+',1)';
			newestHR.css('color', thecolor);
			newestHR.animate({
			    marginLeft: 0
			}, 250, function() {
			    // Animation complete.
			});
			var spans = hrdisplay.find('span');
			var lastspan = spans.eq(spans.length - 1);
			if(lastspan.position().left > hrdisplay.width()) {
				lastspan.remove();
			}

			var hr_threshold = 75;
			if(params.h >= hr_threshold && !recording.hasClass('showing')) {
				recording.addClass('showing');
				socket.emit('record', 'start');
			} else if (params.h < hr_threshold && recording.hasClass('showing')) {
				recording.removeClass('showing');
				socket.emit('record', 'stop');
			}
		}
	});
});