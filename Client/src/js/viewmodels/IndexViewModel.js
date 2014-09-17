define(['jQuery', 'knockout', 'websocket/WebSocketClient', 'game/Game', 'game/GUI'], function($, ko, WebSocketClient, Game, GUI) {
    return function IndexViewModel() {
        var self = this;

        // Create observables
        self.userName = ko.observable();
        self.serverMessages = ko.observableArray();
        self.players = ko.observableArray();
        self.gameActive = ko.observable(false);
        self.connected = ko.observable(false);
        self.userList = ko.observable();
        self.leaderBoard = ko.observable();
        self.statsDisplay = ko.observable();

        self.player1Score = ko.observable(0);
        self.player2Score = ko.observable(0);

        self.playerTurnName = ko.observable('');
        self.playerTurnString = ko.computed(function() {
            return self.playerTurnName() !== '' ? self.playerTurnName() + '\'s Turn' : '';
        });
        self.lobbyChatMessage = ko.observable();
        self.lobbyChatWindow = ko.observableArray();
        self.lobbyChatSelected = ko.observable(false);
        self.chatSelected = ko.computed( function() {
            return self.lobbyChatSelected();
        });
        

        self.game = null;
        
        $(document).ready(function() {
    $("body").tooltip({ selector: '[data-toggle=tooltip]' });
});

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
                    data.sort( function(a, b) {
                        var bPercent;
                        var aPercent;
                        
                        bPercent = 100 * b.wins / b.gamesPlayed;
                        aPercent = 100 * a.wins / a.gamesPlayed;
                        
                        aPercent = aPercent || 0;
                        bPercent = bPercent || 0;
                        
                        if (aPercent === bPercent) {
                            return b.wins - a.wins;
                        }
                        
                       return bPercent - aPercent; 
                    });
                    self.leaderBoard(data);
                }
            });
        }; 
        
        self.getLeaderboard();
        
        self.updateUserStats = function(userName, winIncrement) {
            $.ajax({
                url: baseURI + '/stats/' + userName + '/' + winIncrement,
                type: 'POST',
                success: function(data) {
                    console.log(data);
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
        
        self.scrollChatWindow = function() {
            $(".chat-window-lobby-wrapper").animate({ scrollTop: $(document).height() }, "fast");
            return false;
        };

        // Display information messages to the user
        var onMessage = function(message) {

            switch (message.messageType) {
                case 'gameStart':
                    self.gameActive(true);
                    self.players(message.messageData);
                    if (!self.game) {
                        self.createGame();
                    }
                    self.game.initalise(self.players());
                    break;
                case 'gameClose':
                    self.gameActive(false);
                    self.players.removeAll();
                    self.lobbyChatWindow.removeAll();
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
                case 'lobbyChat':
                    self.lobbyChatWindow.push(message.messageData);
                    self.scrollChatWindow();
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

        self.sendlobbyChatMessage = function() {
            webSocketClient.sendMessage(webSocketClient.createMessage('lobbyChat', {
                'chatMessage': self.lobbyChatMessage(),
                'userName': self.userName()
            }));
            self.lobbyChatMessage('');
        };

        self.createGame = function(){
            var gameTick = 200;

            var gui = new GUI(gameTick);
            self.game = new Game(self, gui, gameTick);
           
            gui.onInput = function(direction){
                self.game.makeMove(direction);
            };
        };
    };
});