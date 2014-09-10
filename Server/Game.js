function Game(server, webSocketServer, clients) {
    var self = this;

    self.scores = [];
    self.clients = clients;

    // Sends a message to all game clients
    self.broadcastToClients = function(message) {

        self.clients.forEach(function(client) {
            client.socket.send(message);
        });
    };

    // Sends a message to all game clients except one
    self.broadcastToAllClientsExcept = function(message, exceptedClient) {

        self.clients.forEach(function(client) {
            if (client != exceptedClient) {
                client.socket.send(message);
            }
        });
    };

    // Handles incoming messages
    self.handleMessage = function(messageType, messageData, client) {

        if (messageType === 'endGame') {
            self.close();
        }
        self.broadcastToAllClientsExcept(webSocketServer.createSocketMessage(messageType, messageData), client);
    };

    // Gets a list of usernames for the game clients
    self.getUserNames = function() {

        var userNames = [];
        self.clients.forEach(function(client) {
            if (client.user)
                userNames.push(client.user.userName);
        });
        return userNames;
    };

    // Gets a score associated with a client
    self.getScoreByClient = function(client) {
        return self.scores.filter(function(score) {
            return score.client == client;
        })[0];
    };


    // Starts the game
    self.start = function() {

        self.broadcastToClients(webSocketServer.createSocketMessage('gameStart', self.getUserNames()));

        // Set up scores
        self.clients.forEach(function(client) {
            self.scores.push({
                'value': 0,
                'client': client
            });
        });
    };

    // Kill off a game if there are not enough players
    self.killGame = function(droppedClient) {

        // Remove the dropped client from our client list
        self.clients.splice(self.clients.indexOf(droppedClient), 1);

        // Push the remaining clients back to the queue
        self.clients.forEach(function(client) {

            client.gameServer = null;
        });

        // Close the game
        self.close();
    };

    // Closes off the game
    self.close = function() {
        // Send closing down message to all clients
        self.broadcastToClients(webSocketServer.createSocketMessage('gameClose', ''));
        server.closeGame(self);
    };
}

module.exports.Game = Game;