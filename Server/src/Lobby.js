/* global */
function Lobby(webSocketServer) {
    
    var self = this;
    
    // Requires 
    var g = require('./Game.js');

    this.clients = [];
    this.players = [];
    this.clientQueue = [];
    this.games = [];
    
    //this.httpServer = null;
    //this.webSocketServer = webSocketServer;
    this.displayUserList = function() {
        webSocketServer.broadcastMessage(webSocketServer.createSocketMessage('userListPrompt', '' ), self.clients)
    }
    // Set up callbacks
    webSocketServer.onNewClient = function(client) {
        self.clients.push(client);
        //send message prompting ajax call for users 
        self.displayUserList();
    };
    
    webSocketServer.onClientClose = function(socket){

        var client = self.getClientBySocket(socket);
        
        // Remove the client from our list
        self.clients.splice(self.clients.indexOf(client), 1);
        //send message prompting ajax call for users 
        self.displayUserList();
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
    };
    
    webSocketServer.onClientJoin = function(socket, userName){
        var client = self.getClientBySocket(socket);
            
        if(!client.user){
            client.user = { 'userName' : userName };
        }
        
        self.addToQueue(client);  
    };
    
    webSocketServer.onMessage = function(socket, message){
        var client = self.getClientBySocket(socket);
        
        if(client.gameServer !== null){
            
            client.gameServer.handleMessage(message, message.messageType, client);
            
        }
    };
    
    // Gets a client associated with a socket
    this.getClientBySocket = function(socket) {
        
        return self.clients.filter(function(client){
           return client.socket == socket;
        })[0];
        
    };
    
    // Adds a player to the queue and checks if there are any groupings
    this.addToQueue = function(client){
        
        self.clientQueue.push(client);
        self.checkQueue();
    };
    
    // Check the queue for possible groupings
    this.checkQueue = function(){
        
        if(self.clientQueue.length >= 2){
            var gameClients = self.clientQueue.splice(0, 2);
            self.createGame(gameClients);
            self.checkQueue();
        }
    };
    
    // Creates a new game
    this.createGame = function(clients){
        var game = new g.Game(self, webSocketServer, clients);
        self.games.push(game);
        
        clients.forEach(function(client){
            client.gameServer = game;
        });
       
        game.start();
    };
    
    // Closes off a game
    this.closeGame = function(gameServer){
        self.games.splice(self.games.indexOf(gameServer), 1);
    };
}

module.exports.Lobby = Lobby;