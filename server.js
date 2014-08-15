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

var players = [];

function findPlayerBySocket(socket)
{
    return players.filter(function(element){
       return element.socket == socket;
    });
}

function getPlayerNames()
{
    var playerNames = [];
    players.forEach(function(player){
        playerNames.push(player.userName);
    });
    return playerNames;
}

// Listen for socket connections
wss.on('connection', function(socket){
    console.log("Client connected");
    // Add the new socket to our list of sockets
    sockets.push(socket);
    
    // Send a success message to the client
    socket.send(createMessage('info', 'Connected'));
    
    // Set up handler for incoming messages
    socket.on('message', function(message)
    {
       handleMessage(message, socket);
    });
    
    // Handle socket closes by removing the socket from our list
    socket.on('close', function()
    {
        sockets.splice(sockets.indexOf(socket));
        
        players.splice(players.indexOf(findPlayerBySocket(socket)));
    });
});

// Create a JSON message to be sent to the user
function createMessage(messageType, messageData)
{
    return JSON.stringify({'messageType': messageType, 'messageData' : messageData});
}

// Send a message to all sockets
function broadcastMessage(message)
{
    sockets.forEach(function(socket)
    {
        socket.send(message);
    });
}

// Handle an incoming message
function handleMessage(socketMessage, socket)
{
    var message = JSON.parse(""+socketMessage);
    
    if (players.length < 2)
    {
        players.push({'userName': message.messageData, 'socket': socket});
        
        socket.send(createMessage('info', "Waiting for The Game to start"));
        
        if (players.length == 2)
        {
            broadcastMessage(createMessage('info', "The Game is starting"));
            broadcastMessage(createMessage('playerInfo', getPlayerNames()));
        }
    }
    else 
    {
        socket.send(createMessage('info', "Server is currently full"));
    }
}