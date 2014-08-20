/* global GameServer */
function Server() {
    
     var self = this;
     
     var gs = require('./GameServer.js');
     
    self.clients = [];
    self.players = [];
    self.clientQueue = [];
    
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
            
            // Create a new client
            self.clients.push(
                {
                    'socket' : socket,
                    'user' : null,
                    'gameServer' : null
                }
            );
            
            // Send a success message to the client
            socket.send(self.createMessage('info', 'Connected'));
            
            // Set up handler for incoming messages
            socket.on('message', function(message) {
               self.handleMessage(message, socket);
            });
            
            // Handle socket closes
            socket.on('close', function(){
                var client = self.getClientBySocket(socket);
                
                //if(client){
                    // Remove the client from our list
                    self.clients.splice(self.clients.indexOf(client), 1);
                    
                    // Remove the client from the queue (if they are in it)
                    var clientQueueIndex = self.clientQueue.indexOf(client);
                    if(clientQueueIndex != -1)
                    {
                        self.clientQueue.splice(clientQueueIndex, 1);
                    }
                    
                    // Close thier game (if they are in one)
                    if(client.gameServer){
                        client.gameServer.killGame(client);
                    }
                //}
            });
        });
    };
    
    // Gets a client associated with a socket
    this.getClientBySocket = function(socket) {
        return self.clients.filter(function(client){
           return client.socket == socket;
        })[0];
    };
    
    // Create a JSON message to be sent to the user
    this.createMessage = function(messageType, messageData) {
        return JSON.stringify({'messageType': messageType, 'messageData' : messageData});
    };
    
    // Send a message to all clients
    this.broadcastMessage = function(message)
    {
        self.clients.forEach(function(client)
        {
            client.socket.send(message);
        });
    };
    
    // Adds a player to the queue and checks if there are any groupings
    this.addToQueue = function(client){
        
        self.clientQueue.push(client);
        client.socket.send(self.createMessage('info', 'Waiting for game partner'));
        
        self.checkQueue();
    };
    
    // Check the queue for possible groupings
    this.checkQueue = function(){
        if(self.clientQueue.length >= 2){
            var gameClients = self.clientQueue.splice(0, 2);
            var gameServer = new gs.GameServer(self, gameClients);
            gameClients.forEach(function(client){
                client.gameServer = gameServer;
            });
           
            gameServer.start();
            self.checkQueue();
        }
    };
    
    // Handle an incoming message
    this.handleMessage = function(socketMessage, socket) {
        var message = JSON.parse(""+socketMessage);
        var messageType = message.messageType;
        
        var client = self.getClientBySocket(socket);
        //if(client) {
            if(messageType == 'join') {
                
                if(!client.user){
                    client.user = { 'userName' : message.messageData };
                }
                
                self.addToQueue(client);
                
            } else if(client.gameServer !== null){
                client.gameServer.handleMessage(message, messageType, client);
            }
        //}
    };
}

var module = module || {};
module.exports = module.exports || {};
module.exports.Server = Server;