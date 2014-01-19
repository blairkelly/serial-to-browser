var socket = io.connect('http://localhost:8080');
var lastt = 0;
var rec = $('.recording');
var lastthrottle = 0;

var collecteddata = new Array();

$(document).ready(function () {
	var element = $('.textdisplay');
	//element.html('Welcome');
	socket.on('serialEvent', function (data) {
		var n = data.value.split("&");
		var params = {};
		for(var i = 0; i<n.length; i++) {
			//element.append(n[i] + "<br/>");
			params[n[i].substring(0, 1)] = n[i].substring(1, n[i].length);
		}
		if(params.t) {
			if(params.Y) {
				if(rec.hasClass('visible')) {
					//visible. stop recording
					rec.removeClass('visible');
					// create a simple data array that we'll plot with a line (this array represents only the Y values, X will just be the index location)
					//var data = [3, 6, 2, 7, 5, 2, 0, 3, 8, 9, 2, 5, 9, 3, 6, 3, 6, 2, 7, -5, 2, 1, 3, 8, 9, 2, 5, 9, 2, 7];
					console.log(collecteddata);
					drawlg(collecteddata);
				} else {
					//not visible. clear data then show recording bar
					$('#graph').empty();
					collecteddata.length = 0;
					collecteddata[0] = [];
					collecteddata[1] = [];
					collecteddata[2] = [];
					console.log(collecteddata);
					rec.addClass('visible');
				}
			}
			if(rec.hasClass('visible') && (params.z)) {
				collecteddata[0].push(params.t);
				collecteddata[1].push(params.z);
				collecteddata[2].push(params.T || lastthrottle);
			}
			if(params.T) {
				var gadj = Math.abs(params.T);
				segDisplay.value(gadj);
				gauge.value(params.T);
			}
			lastt = params.t;
			element.html(data.value + '<br/>');
			element.append(params.t);
		}
	});

	//drawmultiline();
});