define(['jQuery', 'knockout', 'websocket/WebSocketClient', 'game/Game'], function($, ko, WebSocketClient, Game) {
    return function IndexViewModel() {
        var self = this;

        // Create observables
        self.userName = ko.observable('User' + Math.floor(Math.random() * 1000));
        self.serverMessages = ko.observableArray();
        self.players = ko.observableArray();
        self.gameActive = ko.observable(false);
        self.connected = ko.observable(false);
        self.userList = ko.observable();
        self.leaderBoard = ko.observable();
        self.statsDisplay = ko.observable();

        self.redScore = ko.observable(0);
        self.blueScore = ko.observable(0);
        self.playerTurnName = ko.observable('');
        self.playerTurnString = ko.computed(function() {
            return self.playerTurnName() !== '' ? self.playerTurnName() + '\'s Turn' : '';
        });
        self.gameChatMessage = ko.observable();
        self.gameChatWindow = ko.observableArray();
        self.lobbyChatMessage = ko.observable();
        self.lobbyChatWindow = ko.observableArray();
        self.gameChatSelected = ko.observable(false);
        self.lobbyChatSelected = ko.observable(false);
        self.chatSelected = ko.computed( function() {
            return self.gameChatSelected() || self.lobbyChatSelected();
        });

        self.game = null;

        var baseURI = 'http://' + window.location.hostname + (window.location.hostname == "localhost" ? ":8080" : "");

        self.toggleStats = function(user) {
            if (self.statsDisplay() == user.userName) {
                self.statsDisplay(false);
            } else {
                self.statsDisplay(user.userName);
            }
        };

        self.getLeaderboard = function() {
            $.ajax({
                url: baseURI + '/stats',
                type: 'GET',
                success: function(data) {
                    self.leaderBoard(data);
                }
            });
        };

        self.getUserList = function() {
            $.ajax({
                url: baseURI + '/users',
                type: 'GET',
                success: function(data) {
                    self.userList(data);
                }
            });
        };

        // Display information messages to the user
        var onMessage = function(message) {

            switch (message.messageType) {
                case 'gameStart':
                    self.gameActive(true);
                    self.players(message.messageData);
                    if (!self.game) {
                        self.game = new Game(self, self.players(), $('.game-container'));
                    }
                    self.game.initalise();
                    break;
                case 'gameClose':
                    self.gameActive(false);
                    self.players.removeAll();
                    //self.game.clear();
                    break;
                case 'endGame':
                    self.game.checkWinStatus();
                    break;
                case 'userListPrompt':
                    self.getUserList();
                    break;
                case 'leaderBoardPrompt':
                    self.getLeaderboard();
                    break;
                case 'gameMove':
                    if (self.game) {
                        self.game.move(message.messageData);
                    }
                    break;
                case 'addTile':
                    if (self.game) {
                        self.game.addTile(message.messageData);
                    }
                    break;
                case 'gameChat':
                    self.gameChatWindow.unshift(message.messageData);
                    break;
                case 'lobbyChat':
                    self.lobbyChatWindow.unshift(message.messageData);
                    break;
            }
        };

        var onConnected = function() {
            self.connected(true);
            var joinMessage = webSocketClient.createMessage('join', self.userName());
            webSocketClient.sendMessage(joinMessage);
        };

        var onClose = function() {
            self.connected(false);
            self.gameActive(false);
            self.players.removeAll();
        };

        var webSocketClient = new WebSocketClient(onConnected, onMessage, onClose);

        self.connectWebSocket = function() {
            webSocketClient.connect();
        };

        self.sendMove = function(direction) {
            webSocketClient.sendMessage(webSocketClient.createMessage('gameMove', direction));
        };

        self.sendTile = function(tile) {
            webSocketClient.sendMessage(webSocketClient.createMessage('addTile', tile));
        };

        self.challengePlayer = function(userName) {
            webSocketClient.sendMessage(webSocketClient.createMessage('challenge', userName));
        };

        self.endGame = function() {
            webSocketClient.sendMessage(webSocketClient.createMessage('endGame', ''));
        };

        self.sendGameChatMessage = function() {
            webSocketClient.sendMessage(webSocketClient.createMessage('gameChat', {
                'chatMessage': self.gameChatMessage(),
                'userName': self.userName()
            }));
        };

        self.sendLobbyChatMessage = function() {
            webSocketClient.sendMessage(webSocketClient.createMessage('lobbyChat', {
                'chatMessage': self.lobbyChatMessage(),
                'userName': self.userName()
            }));
        };
    };
});