const SerialPort = require('serialport')
const Readline = require('@serialport/parser-readline')
const { exec } = require("child_process");

const express = require('express')
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
console.log("starting up")
app.use(express.static('public'))

let sPort = null;
let statusCode = 0;
let connectedPort = null;


function sendData(socket) {
    sPort.on('error', function (err) {
        statusCode = 0;
        console.log('Error: ', err.message)
    })
    const parser = new Readline()

    sPort.pipe(parser)

    parser.on('data', line => {
        socket.emit('data', line);
        //   console.log( line)
    })

}



io.on('connection', (socket) => {

    if (statusCode === 1) {
        socket.emit("connected", connectedPort)
        sendData(socket)
    }

    exec("serialport-list -f json", (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            return;
        }

        socket.emit('ports', stdout)
        // console.log(`Listing Serial Ports: ${stdout}`);
    });



    socket.on('connectPort', (data) => {
        sPort = new SerialPort(data, { baudRate: 9600 })
        connectedPort = data;
        statusCode = 1;
        socket.emit("connected", connectedPort)
        sendData(socket)
    });


});


server.listen(3500);

