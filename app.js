// var express = require('express');
// var http = require("http")
// var app = express();
// app.use(express.static(__dirname + "/"))

// var server = http.createServer(app)
// server.listen(5000, function(){
//     console.log('App running on port 3000!');
// })

// var WebSocketServer = require("ws").Server
// var wss = new WebSocketServer({server: server})

// var serialport = require("serialport");
// var SerialPort = serialport.SerialPort;
// var port = process.argv[2];
// var serialport = new SerialPort(port, {
//   baudrate: 9600,
//   parser: serialport.parsers.readline("\n")
// });

// serialport.on('data', function(data){
//     var value = ""
//     for (p in data) value += data[p];
//     wss.clients.forEach(function each(ws) {
//       ws.send(JSON.stringify(value), function() {  })
//     });
// });


// var server = http.createServer(app)
// server.listen(5000, function(){
//     console.log('App running on port 3000!');
// })

let webSocketsServerPort = 1337;
const WebSocket = require('ws'); // https://github.com/websockets/ws
const SerialPort = require('serialport'); // https://github.com/serialport/node-serialport
const Readline = require('@serialport/parser-readline');

// Create an simple HTTP server
const httpServer = http.createServer(app)
httpServer.listen(5000, function () {
  console.log('App running on port 5000!');
})

const webSocketServer = new WebSocket.Server({
  port: webSocketsServerPort
});

// console.log(process.argv) // DEBUG
// Choose the serial port from /dev (e.g. /dev/tty.usbmodem1421)
var serialPortValue = '/dev/tty.usbmodem1421';
if (process.argv[2] !== undefined) serialPortValue = process.argv[2];
console.log('DEBUG:serialPortValue:' + serialPortValue);

var webSocketsServerPort = 8888;
if (process.argv[3] !== undefined) webSocketsServerPort = parseInt(process.argv[3]);
console.log('DEBUG:webSocketsServerPort:' + webSocketsServerPort); // DEBUG

const parserReadline = new Readline();
var serialPort = new SerialPort(serialPortValue, {
  baudRate: 9600,
  parser: parserReadline
});

serialPort.pipe(parserReadline);

parserReadline.on('data', data => {
  console.log(`${serialPortValue} > ${data}`);

  let value = '';
  for (p in data) value += data[p];
  webSocketServer.clients.forEach(ws => {
    ws.send(JSON.stringify(value), () => {})
  });
});

webSocketServer.on('connection', function connection(ws) {
  console.log(`New client connected on port ${webSocketsServerPort}!`);
});