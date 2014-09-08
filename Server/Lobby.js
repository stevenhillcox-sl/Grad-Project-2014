/* global */
function Lobby(webSocketServer) {
    
    var self = this;
    
    // Requires 
    var g = require('./Game.js');
    var r = require('./Repository.js');
    var repository = new r.Repository();
    repository.connect();
    this.clients = [];
    this.players = [];
    this.clientQueue = [];
    this.games = [];
    
    //this.httpServer = null;
    //this.webSocketServer = webSocketServer;
    this.displayUserList = function() {
        webSocketServer.broadcastMessage(webSocketServer.createSocketMessage('userListPrompt', '' ), self.clients);
    };
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
        //OBSOLETE QUEUEING SYSTEM
        // var clientQueueIndex = self.clientQueue.indexOf(client);
        // if(clientQueueIndex != -1)
        // {
        //     self.clientQueue.splice(clientQueueIndex, 1);
        // }
        
        
        // Close thier game (if they are in one)
        if(client.game){
            client.game.killGame(client);
        }
    };
    
    webSocketServer.onClientJoin = function(socket, userName){
        var client = self.getClientBySocket(socket);
        
            
        if(!client.user){
            repository.getUser(userName, function(databaseUser){
                
                if (databaseUser) {
                    client.user = databaseUser;
                } else {
                    client.user = { 'userName' : userName,
                                    'gamesPlayed': 0,
                                    'wins' : 0,
                                    'highScore' : 0,
                                    'winPercentage': 0
                    };
                    repository.addUser(client.user);
                }
            });
        }
        
        //self.addToQueue(client);  
    };
    
    webSocketServer.onClientChallenge = function(socket, userName){
        
        var challengerClient = self.getClientBySocket(socket);
        var challengedClient = self.getClientByUserName(userName);
        
        // if(challengedClient.game || challengerClient.game){
        //     webSocketServer.sendMessage(webSocketServer.createSocketMessage('info', 'Player can not be challenged at this time'), challengerClient);
        // } else if ( challengerClient == challengedClient ) {
        //     webSocketServer.sendMessage(webSocketServer.createSocketMessage('info', 'You cannot challenge yourself'), challengerClient);
        // } 
        self.createGame([challengerClient, challengedClient]);
    };
    
    webSocketServer.onMessage = function(socket, message){
        var client = self.getClientBySocket(socket);
        
        if(client.game !== null){
            
            client.game.handleMessage(message.messageType, message.messageData, client);
            
        }
    };

    // Gets a client associated with a socket
    this.getClientBySocket = function(socket) {
        
        return self.clients.filter(function(client){
           return client.socket == socket;
        })[0];
        
    };
    
    // Gets a client associated with a userName
    // Note: This will return the first client found with that username
    this.getClientByUserName = function(userName) {
        
        return self.clients.filter(function(client){
           return client.user.userName == userName;
        })[0];
        
    };
    // Obsolete queueing system
    
    // // Adds a player to the queue and checks if there are any groupings
    // this.addToQueue = function(client){
        
    //     self.clientQueue.push(client);
    //     self.checkQueue();
    // };
    
    // // Check the queue for possible groupings
    // this.checkQueue = function(){
        
    //     if(self.clientQueue.length >= 2){
    //         var gameClients = self.clientQueue.splice(0, 2);
    //         self.createGame(gameClients);
    //         self.checkQueue();
    //     }
    // };
    
    // Creates a new game
    this.createGame = function(clients){
        var game = new g.Game(self, webSocketServer, clients);
        self.games.push(game);
        
        clients.forEach(function(client){
            client.game = game;
            client.user.gamesPlayed++;
        });
       
        game.start();
        self.displayUserList();
    };
    
    // Closes off a game
    this.closeGame = function(game){
        game.clients.forEach(function(client){
           client.game = null; 
           repository.persistUser(client.user);
        });
        self.games.splice(self.games.indexOf(game), 1);
        self.displayUserList();
        webSocketServer.broadcastMessage(webSocketServer.createSocketMessage('leaderBoardPrompt', ''), self.clients);
    };
}

module.exports.Lobby = Lobby;