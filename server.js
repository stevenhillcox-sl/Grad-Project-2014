// Requires
var express = require('express');
var app = express();
var http = require('http').Server(app);
var ws = require('ws').Server;

// Start listening for http requests
http.listen(process.env.PORT, process.env.IP,  function(){
    console.log('Http server starting on port ' + process.env.PORT );
});

// Expose html folder as a static webserver
app.use(express.static("/home/ubuntu/workspace/html"));

//
/// --> Server logic
//

var sockets = [];
var wss = new ws({server : http});

// Listen for socket connections
wss.on('connection', function(socket){
    console.log('Connection established');
    sockets.push(socket);
    
    socket.send('Welcome to the server');
    
    socket.on('message', function(message)
    {
       handleMessage(message, socket);
    });
});

wss.on('close', function(socket){
     sockets.splice(sockets.indexOf(socket));
});

function broadcastMessage(message)
{
    for(var i in sockets)
    {
        sockets[i].send(message)
    }
}

function handleMessage(message, socket)
{
    broadcastMessage(message);
}