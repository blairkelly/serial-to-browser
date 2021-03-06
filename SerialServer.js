/*
  serialServer.js
  a node.js app to read serial strings and send them to webSocket clients
  requires:
    * node.js (http://nodejs.org/)
    * express.js (http://expressjs.com/)
    * socket.io (http://socket.io/#how-to-use)
    * serialport.js (https://github.com/voodootikigod/node-serialport)
    
  based on the core examples for socket.io and serialport.js
    
  created 21 Aug 2012
  modified 14 Oct 2013
  by Tom Igoe
  
  Patches and improvements suggested by Steve Klise, Lia Martinez, and Will Jennings

*/

var request = require('request');

var serialport = require("serialport"),     // include the serialport library
  SerialPort  = serialport.SerialPort,      // make a local instance of serial
  app = require('express')(),           // start Express framework
    server = require('http').createServer(app), // start an HTTP server
    io = require('socket.io').listen(server),   // filter the server using socket.io
    serialData = {};                    // object to hold what goes out to the client
    
//var portName = process.argv[2];           // third word of the command line should be serial port name
//var portName = "/dev/tty.usbmodem1411";      // specific
//var portName = "/dev/cu.usbserial-A4013EXK"; //xbee xplorer usb mac.
var portName = "/dev/ttyUSB0"; //lower port on Raspi, Xbee Xlplorer
//var portName = "usb-FTDI_FT232R_USB_UART_A4013EXK-if00-port0"; //xbee xplorer on Raspi, test. Global?

io.set('log level', 1);
server.listen(8080);                    // listen for incoming requests on the server

console.log("Listening for new clients on port 8080");

// open the serial port. Change the name to the name of your port, just like in Processing and Arduino:
var myPort = new SerialPort(portName, { 
  baudrate: 57600,
  // look for return and newline at the end of each data packet:
  parser: serialport.parsers.readline("\r\n") 
});

// respond to web GET requests with the index.html page:
app.get('/', function (request, response) {
  response.sendfile(__dirname + '/index.html');
});
app.get('/style.css', function (request, response) {
  response.sendfile(__dirname + '/style.css');
});
app.get('/jquery-2.0.3.min.js', function (request, response) {
  response.sendfile(__dirname + '/jquery-2.0.3.min.js');
});
app.get('/jquery-2.0.3.min.map', function (request, response) {
  response.sendfile(__dirname + '/jquery-2.0.3.min.map');
});
app.get('/scripts.js', function (request, response) {
  response.sendfile(__dirname + '/scripts.js');
});

// listen for new socket.io connections:
io.sockets.on('connection', function (socket) {
  console.log('someone connected');
  // if there's a socket client, listen for new serial data:
  myPort.on('data', function (data) {
    // set the value property of scores to the serial string:
    serialData.value = data;
    // for debugging, you should see this in Terminal:
    //console.log(data);
    // send a serial event to the web client with the data:
    socket.emit('serialEvent', serialData);
  });



  socket.on('record', function(instruction) {
    console.log(instruction + " recording.");
    if(instruction == "start") {
      request('http://10.5.5.9/bacpac/SH?t=blairpro2&p=%01', function (error, response, body) {
        if (!error && response.statusCode == 200) {
          console.log("camera started");
        }
      });
    } else if (instruction == "stop") {
      request('http://10.5.5.9/bacpac/SH?t=blairpro2&p=%00', function (error, response, body) {
        if (!error && response.statusCode == 200) {
          console.log("camera stopped");
        }
      });
    }
  });

});