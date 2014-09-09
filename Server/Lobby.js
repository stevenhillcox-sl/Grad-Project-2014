/* global */
function Lobby(webSocketServer, repository) {

    var self = this;

    // Requires 
    var g = require('./Game.js');
    // var r = require('./Repository.js');
    // var repository = new r.Repository();
    // repository.connect();

    self.clients = [];
    self.players = [];
    self.clientQueue = [];
    self.games = [];

    // Prompt users to update thier list of clients
    var promptUserList = function() {
        webSocketServer.broadcastMessage(webSocketServer.createSocketMessage('userListPrompt', ''), self.clients);
    };

    // Prompt users to update thier leaderboard
    var promptLeaderBoard = function() {
        webSocketServer.broadcastMessage(webSocketServer.createSocketMessage('leaderBoardPrompt', ''), self.clients);
    };

    webSocketServer.onNewClient = function(client) {
        self.clients.push(client);
        promptUserList();
    };

    webSocketServer.onClientClose = function(socket) {

        var client = self.getClientBySocket(socket);

        // Remove the client from our list
        self.clients.splice(self.clients.indexOf(client), 1);
        promptUserList();

        // Close thier game (if they are in one)
        if (client.game) {
            client.game.killGame(client);
        }
    };

    webSocketServer.onClientJoin = function(socket, userName) {
        var client = self.getClientBySocket(socket);


        if (!client.user) {
            repository.getUser(userName, function(databaseUser) {

                if (databaseUser) {
                    client.user = databaseUser;
                } else {
                    client.user = {
                        'userName': userName,
                        'gamesPlayed': 0,
                        'wins': 0,
                        'highScore': 0,
                        'winPercentage': 0
                    };
                    repository.addUser(client.user);
                }
            });
        }
    };

    webSocketServer.onClientChallenge = function(socket, userName) {

        var challengerClient = self.getClientBySocket(socket);
        var challengedClient = self.getClientByUserName(userName);

        self.createGame([challengerClient, challengedClient]);
    };

    webSocketServer.onMessage = function(socket, message) {
        var client = self.getClientBySocket(socket);
        
        switch (message.messageType) {
            case 'gameChat':
                if (client.game !== null) {
                    client.game.broadcastToClients(webSocketServer.createSocketMessage(message.messageType, message.messageData));
                }
                break;
            case 'lobbyChat':
                webSocketServer.broadcastMessage(webSocketServer.createSocketMessage(message.messageType, message.messageData), self.clients);
                break;
            default:
                if (client.game !== null) {
                    client.game.handleMessage(message.messageType, message.messageData, client);
                }
                break;
        }
    };

    // Gets a client associated with a socket
    self.getClientBySocket = function(socket) {

        return self.clients.filter(function(client) {
            return client.socket == socket;
        })[0];

    };

    // Gets a client associated with a userName
    self.getClientByUserName = function(userName) {

        return self.clients.filter(function(client) {
            return client.user.userName == userName;
        })[0];

    };

    // Creates a new game
    self.createGame = function(clients) {
        var game = new g.Game(self, webSocketServer, clients);
        self.games.push(game);

        clients.forEach(function(client) {
            client.game = game;
            client.user.gamesPlayed++;
        });

        game.start();
        promptUserList();
    };

    // Closes off a game
    self.closeGame = function(game) {
        game.clients.forEach(function(client) {
            client.game = null;
            repository.persistUser(client.user);
        });
        self.games.splice(self.games.indexOf(game), 1);
        promptUserList();
        promptLeaderBoard();
    };
}

module.exports.Lobby = Lobby;