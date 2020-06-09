const SerialPort = require('serialport')
const Readline = require('@serialport/parser-readline')

const express = require('express')
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
console.log("starting up")
app.use(express.static('public'))
const path = "COM3"
console.log(`connecting to ${path}`)
const port = new SerialPort(path, { baudRate: 9600 })

io.on('connection', (socket) => {
   
    const parser = new Readline()
    port.pipe(parser)

    parser.on('data', line => {
     socket.emit('data', line);
     //   console.log( line)
    })

    socket.on('my other event', (data) => {
        console.log(data);
    });
});
server.listen(3500);

