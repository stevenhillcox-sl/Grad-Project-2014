function Game(server, webSocketServer, clients)
{
    var self = this;
    
    this.scores = [];
    this.clients = clients;
    
    // Sends a message to all game clients
    this.broadcastToClients = function(message){
        
        self.clients.forEach(function(client){
            client.socket.send(message);
        });
    };
    
    // Sends a message to all game clients except one
    this.broadcastToAllClientsExcept = function(message, exceptedClient){
        
        self.clients.forEach(function(client){
            if(client != exceptedClient){
                client.socket.send(message);
            }
        });
    };
    
    // Handles incoming messages
    this.handleMessage = function(messageType, messageData, client) {
        
        switch(messageType) {
            case 'endGame':
                self.close();
                break;
            case 'gameMove':
                self.broadcastToClients(webSocketServer.createSocketMessage(messageType, messageData), client);
                break;
            case 'addTile':
                self.broadcastToClients(webSocketServer.createSocketMessage(messageType, messageData), client);
                break;
            case 'chat':
                self.broadcastToClients(webSocketServer.createSocketMessage(messageType, messageData), client);
        }
    };
    
    // Gets a list of usernames for the game clients
    this.getUserNames = function(){
        
        var userNames = [];
        self.clients.forEach(function(client){
            if (client.user) 
                userNames.push(client.user.userName);
        });
        return userNames;
    };
    
    // Gets a score associated with a client
    this.getScoreByClient = function(client){
         return self.scores.filter(function(score){
           return score.client == client;
        })[0];
    };
    
    
    // Starts the game
    this.start = function(){
        
        self.broadcastToClients(webSocketServer.createSocketMessage('gameStart', ''));
        self.broadcastToClients(webSocketServer.createSocketMessage('playerInfo', self.getUserNames()));
        
        // Set up scores
        self.clients.forEach(function(client){
            self.scores.push({'value' : 0, 'client' : client});
        });
    };
    
    // Ends the game
    this.endGame = function(){
        
        self.close();
    };
    
    // Kill off a game if there are not enough players
    this.killGame = function(droppedClient){
        
        // Remove the dropped client from our client list
        self.clients.splice(self.clients.indexOf(droppedClient), 1);
        
        // Push the remaining clients back to the queue
        self.clients.forEach(function(client){
            
            client.gameServer = null;
            
            // server.addToQueue(client);
        });
        
        // Close the game
        self.close();
    };
    
    // Closes off the game
    this.close = function() {
        
        // Send closing down message to all clients
        self.broadcastToClients(webSocketServer.createSocketMessage('gameClose', ''));
        server.closeGame(self);
    };
}

module.exports.Game = Game;