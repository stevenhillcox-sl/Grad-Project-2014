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
    self.promptUserList = function() {
        webSocketServer.broadcastMessage(webSocketServer.createSocketMessage('userListPrompt', ''), self.clients);
    };

    // Prompt users to update thier leaderboard
    self.promptLeaderBoard = function() {
        webSocketServer.broadcastMessage(webSocketServer.createSocketMessage('leaderBoardPrompt', ''), self.clients);
    };

    webSocketServer.onNewClient = function(client) {
        self.clients.push(client);
        self.promptUserList();
    };

    webSocketServer.onClientClose = function(socket) {

        var client = self.getClientBySocket(socket);

        // Remove the client from our list
        self.clients.splice(self.clients.indexOf(client), 1);
        self.promptUserList();

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
                        'highScore': 0
                    };
                    repository.addUser(client.user);
                }
            });
        }
    };

    webSocketServer.onClientChallenge = function(socket, userName) {

        var challengerClient = self.getClientBySocket(socket);
        var challengedClient = self.getClientByUserName(userName);

        if(challengerClient !== challengedClient && !challengerClient.game && !challengedClient.game){
            self.createGame([challengerClient, challengedClient]);
        }
    };

    webSocketServer.onMessage = function(socket, message) {
        var client = self.getClientBySocket(socket);
        
        switch (message.messageType) {
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
            repository.persistUser(client.user);
        });

        game.start();
        self.promptUserList();
    };

    // Closes off a game
    self.closeGame = function(game) {
        game.clients.forEach(function(client) {
            client.game = null;
        });
        self.games.splice(self.games.indexOf(game), 1);
        self.promptUserList();
        // self.promptLeaderBoard();
    };
}

module.exports.Lobby = Lobby;