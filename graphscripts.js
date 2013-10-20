/* GAUGE */
var svg = d3.select("#speedometer")
        .append("svg:svg")
        .attr("width", 342)
        .attr("height", 320);


var gauge = iopctrl.arcslider()
        .radius(120)
        .events(false)
        .indicator(iopctrl.defaultGaugeIndicator);
gauge.axis().orient("in")
        .normalize(true)
        .ticks(12)
        .tickSubdivide(3)
        .tickSize(10, 8, 10)
        .tickPadding(5)
        .scale(d3.scale.linear()
                .domain([-255, 255])
                .range([-3*Math.PI/4, 3*Math.PI/4]));

var segDisplay = iopctrl.segdisplay()
        .width(80)
        .digitCount(6)
        .negative(false)
        .decimals(0);

svg.append("g")
        .attr("class", "segdisplay")
        .attr("transform", "translate(130, 200)")
        .call(segDisplay);

svg.append("g")
        .attr("class", "gauge")
        .call(gauge);

segDisplay.value(0);
gauge.value(0);


Array.min = function( array ){
    return Math.min.apply( Math, array );
};
Array.max = function( array ){
    return Math.max.apply( Math, array );
};






//multiline
var drawmultiline = function (thedata) {
	var margin = {top: 20, right: 80, bottom: 30, left: 50},
	    width = 960 - margin.left - margin.right,
	    height = 500 - margin.top - margin.bottom;

	var parseDate = d3.time.format("%Y%m%d").parse;

	var x = d3.time.scale()
	    .range([0, width]);

	var y = d3.scale.linear()
	    .range([height, 0]);

	var color = d3.scale.category10();

	var xAxis = d3.svg.axis()
	    .scale(x)
	    .orient("bottom");

	var yAxis = d3.svg.axis()
	    .scale(y)
	    .orient("left");

	var line = d3.svg.line()
	    .interpolate("basis")
	    .x(function(d) { return x(d.date); })
	    .y(function(d) { return y(d.temperature); });

	var svg = d3.select("#graph").append("svg")
	    .attr("width", width + margin.left + margin.right)
	    .attr("height", height + margin.top + margin.bottom)
	  .append("g")
	    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	d3.tsv("data.tsv", function(error, data) {
	  color.domain(d3.keys(data[0]).filter(function(key) { return key !== "date"; }));

	  data.forEach(function(d) {
	    d.date = parseDate(d.date);
	  });

	  var cities = color.domain().map(function(name) {
	    return {
	      name: name,
	      values: data.map(function(d) {
	        return {date: d.date, temperature: +d[name]};
	      })
	    };
	  });

	  x.domain(d3.extent(data, function(d) { return d.date; }));

	  y.domain([
	    d3.min(cities, function(c) { return d3.min(c.values, function(v) { return v.temperature; }); }),
	    d3.max(cities, function(c) { return d3.max(c.values, function(v) { return v.temperature; }); })
	  ]);

	  svg.append("g")
	      .attr("class", "x axis")
	      .attr("transform", "translate(0," + height + ")")
	      .call(xAxis);

	  svg.append("g")
	      .attr("class", "y axis")
	      .call(yAxis)
	    .append("text")
	      .attr("transform", "rotate(-90)")
	      .attr("y", 6)
	      .attr("dy", ".71em")
	      .style("text-anchor", "end")
	      .text("Temperature (ºF)");

	  var city = svg.selectAll(".city")
	      .data(cities)
	    .enter().append("g")
	      .attr("class", "city");

	  city.append("path")
	      .attr("class", "line")
	      .attr("d", function(d) { return line(d.values); })
	      .style("stroke", function(d) { return color(d.name); });

	  city.append("text")
	      .datum(function(d) { return {name: d.name, value: d.values[d.values.length - 1]}; })
	      .attr("transform", function(d) { return "translate(" + x(d.value.date) + "," + y(d.value.temperature) + ")"; })
	      .attr("x", 3)
	      .attr("dy", ".35em")
	      .text(function(d) { return d.name; });
	});
}





/* implementation heavily influenced by http://bl.ocks.org/1166403 */
var drawlg = function (thedata) {
	// define dimensions of graph
	var m = [80, 80, 80, 80]; // margins
	var w = 1000 - m[1] - m[3]; // width
	var h = 400 - m[0] - m[2]; // height

	// X scale will fit all values from data[] within pixels 0-w

	var x = d3.scale.linear().domain([0, thedata[0].length]).range([0, w]);
	//var x = d3.scale.linear().domain([thedata[0][0], thedata[0][thedata[0].length]]).range([0, w]);

	var minimum = Array.min(thedata[1]);
	var maximum = Array.max(thedata[1]);
	console.log(minimum + " - " + maximum);
	// Y scale will fit values from 0-10 within pixels h-0 (Note the inverted domain for the y-scale: bigger is up!)
	var y = d3.scale.linear().domain([minimum, maximum]).range([h, 0]);
		// automatically determining max range can work something like this
		// var y = d3.scale.linear().domain([0, d3.max(data)]).range([h, 0]);

	// create a line function that can convert data[] into x and y points
	var line = d3.svg.line()
		// assign the X function to plot our line as we wish
		.x(function(d,i) { 
			// verbose logging to show what's actually being done
			//console.log('Plotting X value for data point: ' + d + ' using index: ' + i + ' to be at: ' + x(i) + ' using our xScale.');
			// return the X coordinate where we want to plot this datapoint
			return x(i); 
		})
		.y(function(d) { 
			// verbose logging to show what's actually being done
			//console.log('Plotting Y value for data point: ' + d + ' to be at: ' + y(d) + " using our yScale.");
			// return the Y coordinate where we want to plot this datapoint
			return y(d); 
		})

		// Add an SVG element with the desired dimensions and margin.
		var graph = d3.select("#graph").append("svg:svg")
		      .attr("width", w + m[1] + m[3])
		      .attr("height", h + m[0] + m[2])
		    .append("svg:g")
		      .attr("transform", "translate(" + m[3] + "," + m[0] + ")");

		// create yAxis
		var xAxis = d3.svg.axis().scale(x).tickSize(-h).tickSubdivide(true);
		// Add the x-axis.
		graph.append("svg:g")
		      .attr("class", "x axis")
		      .attr("transform", "translate(0," + h + ")")
		      .call(xAxis);


		// create left yAxis
		var yAxisLeft = d3.svg.axis().scale(y).ticks(4).orient("left");
		// Add the y-axis to the left
		graph.append("svg:g")
		      .attr("class", "y axis")
		      .attr("transform", "translate(-25,0)")
		      .call(yAxisLeft);
		
		// Add the line by appending an svg:path element with the data line we created above
		// do this AFTER the axes above so that the line is above the tick-lines
		graph.append("svg:path").attr("d", line(thedata[1]));
}
