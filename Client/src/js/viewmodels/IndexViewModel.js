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
        //self.opponent = ko.observable();
        self.statsDisplay = ko.observable();

        self.redScore = ko.observable(0);
        self.blueScore = ko.observable(0);
        self.playerTurnName = ko.observable('');
        self.playerTurnString = ko.computed(function() {
            return self.playerTurnName() !== '' ? self.playerTurnName() + '\'s Turn' : '';
        });

        self.game = null;

        self.toggleStats = function(user) {
            if (self.statsDisplay() == user.userName) {
                self.statsDisplay(false);
            } else {
                self.statsDisplay(user.userName);
            }
        };

        self.getLeaderboard = function() {
            $.ajax({
                url: window.location + 'stats',
                type: 'GET',
                success: function(data) {
                    self.leaderBoard(data);
                }
            });
        };

        self.getLeaderboard();

        // Display information messages to the user
        var onMessage = function(message) {
            switch (message.messageType) {
                case 'playerInfo':
                    self.players(message.messageData);
                    break;
                case 'gameStart':
                    self.gameActive(true);
                    setTimeout(function(){
                        self.game = new Game(self, self.players());
                    }, 1000);
                    break;
                case 'gameClose':
                    self.gameActive(false);
                    self.players.removeAll();
                    break;

                case 'userListPrompt': 
                    $.ajax( {
                        url: 'http://' + window.location.hostname + '/users',
                        type: 'GET',
                        success: function(data) {
                            self.userList(data);
                        }
                    });
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

        self.sendMove = function(direction){
            webSocketClient.sendMessage(webSocketClient.createMessage('gameMove', direction));
        };

        self.sendTile = function(position){
            webSocketClient.sendMessage(webSocketClient.createMessage('addTile', position));
        };

        self.challengePlayer = function(userName) {
            webSocketClient.sendMessage(webSocketClient.createMessage('challenge', userName));
        };

    };
});