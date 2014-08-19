/* global GameServer */
function Server() {
    
     var self = this;
     
     var gs = require('./GameServer.js');
    
    this.start = function(){
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
        
        var wss = new ws({server : http});
        
        // Listen for socket connections
        wss.on('connection', function(socket) {
            
            if(self.players.length < 2) {
            
                // Add the new socket to our list of sockets
                self.sockets.push(socket);
                
                // Send a success message to the client
                socket.send(self.createMessage('info', 'Connected'));
                
                // Set up handler for incoming messages
                socket.on('message', function(message)
                {
                   self.handleMessage(message, socket);
                });
                
                // Handle socket closes by removing the socket from our list
                socket.on('close', function()
                {
                    var socketIndex = self.sockets.indexOf(socket);
                    var playerIndex = self.players.indexOf(self.findPlayerBySocket(socket));
                    
                    if(socketIndex != -1){
                        self.sockets.splice(socketIndex, 1);
                    }
                    
                    if(playerIndex != -1){
                        self.players.splice(playerIndex, 1);
                    }
                    
                    if(self.gameServer != null && socketIndex != -1)
                    {
                        self.closeGame(self.gameServer);
                    }
                });
            } else {
                socket.send(self.createMessage('info', "Server is currently full"));
                socket.close();
            }
        });
    };
    
    //
    /// --> Server logic
    //
    
    self.sockets = [];
    self.players = [];
    
    self.gameServer = null;
    
    this.findPlayerBySocket = function(socket) {
        return self.players.filter(function(element){
           return element.socket == socket;
        })[0];
    };
    
    this.getPlayerNames = function() {
        var playerNames = [];
        self.players.forEach(function(player){
            playerNames.push(player.userName);
        });
        return playerNames;
    };
    
    // Create a JSON message to be sent to the user
    this.createMessage = function(messageType, messageData) {
        return JSON.stringify({'messageType': messageType, 'messageData' : messageData});
    };
    
    // Send a message to all sockets
    this.broadcastMessage = function(message)
    {
        self.sockets.forEach(function(socket)
        {
            socket.send(message);
        });
    };
    
    // Handle an incoming message
    this.handleMessage = function(socketMessage, socket) {
        var message = JSON.parse(""+socketMessage);
        
        var messageType = message.messageType;
        
        if(messageType == 'join') {
            if (self.players.length < 2) {
                self.players.push({'userName': message.messageData, 'socket': socket});
                
                socket.send(self.createMessage('info', "Waiting for The Game to start"));
                
                if (self.players.length == 2)
                {
                    self.broadcastMessage(self.createMessage('info', "The Game is starting"));
                    self.broadcastMessage(self.createMessage('playerInfo', self.getPlayerNames()));
                    self.gameServer = new gs.GameServer(self);
                }
            } 
        } else if(messageType == 'answer') {
            self.gameServer.checkAnswer(message.messageData, socket);
        }
    };
    
    this.closeGame = function(gameServer)
    {
        gameServer = null;
        self.sockets.forEach(function(socket){
            socket.close();
        });
    };
}

var module = module || {};
module.exports = module.exports || {};
module.exports.Server = Server;