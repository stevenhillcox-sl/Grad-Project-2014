define(['jQuery', 'knockout', '../websocket/WebSocketClient'], function($, ko, WebSocketClient){
    
    var IndexViewModel = function() {
        // Create observables
        this.userName = ko.observable('User' + Math.floor(Math.random()*1000));
        this.serverMessages = ko.observableArray();
        this.players = ko.observableArray();
        this.questions = ko.observable();
        this.questionOptions = ko.observableArray();
        this.selectedAnswer = ko.observable();
        this.gameActive = ko.observable(false);
        this.connected = ko.observable(false);
        this.activeQuestion = ko.observable(false);
        this.userList = ko.observable();
        this.leaderBoard = ko.observable();
        this.opponent = ko.observable();
        this.answerResponse = ko.observable();
        this.correctAnswer = ko.observable();
        this.score = ko.observable(null);
        this.result = ko.observable();
        this.statsDisplay = ko.observable();
        
        var self = this;
        
        //
        /// --> Server code
        //
        this.toggleStats = function(user) {
            if (self.statsDisplay() == user.userName) {
                self.statsDisplay(false);
            } else
            {
                self.statsDisplay(user.userName);
            }
        };
        
        this.hideStats = function() {
            self.statsDisplay(false);
        };
        
        var getLeaderboard = function() {
        
            $.ajax( {
                url:  'http://' + window.location.hostname + '/stats',
                type: 'GET',
                success: function(data) {
                self.leaderBoard(data);
                }
            });   
        };
        
        getLeaderboard();
        
        // Display information messages to the user
        var onMessage = function(message){
            switch(message.messageType) {
                case 'playerInfo':
                    self.players(message.messageData);
                    self.opponent((self.userName() == self.players()[0]) ? self.players()[1] : self.players()[0]);
                    break;
                case 'questionOptions':
                    self.questionOptions.removeAll();
                    self.questionOptions(message.messageData);
                    self.activeQuestion(true);
                    break;
                case 'gameStart':
                    self.score(null);
                    self.result(null);
                    self.gameActive(true);
                    break;
                case 'gameClose':
                    self.gameActive(false);
                    self.players.removeAll();
                    self.questions(null);
                    self.answerResponse(null);
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
                    getLeaderboard();
                    break;
                case 'question':
                    self.questions(message.messageData);
                    break;
                case 'answerResponse':
                    self.answerResponse(message.messageData[0]);
                    self.correctAnswer(message.messageData[1]);
                    break;
                case 'gameScore':
                    self.score(message.messageData);
                    break;
                case 'gameResult':
                    self.result(message.messageData);
                    break;
            }
        };
        
        var onConnected = function(){
            // Start the game
            self.connected(true);
            var joinMessage = webSocketClient.createMessage('join', self.userName());
            webSocketClient.sendMessage(joinMessage);
        };
        
        var onClose = function(){
            self.connected(false);
            self.players.removeAll();
            self.questionOptions.removeAll();
        };
        
        var webSocketClient = new WebSocketClient(onConnected, onMessage, onClose);
        
        
        this.connectWebSocket = function() {
            webSocketClient.connect();
        };
        
        this.sendAnswer = function(id) {
            webSocketClient.sendMessage(webSocketClient.createMessage('answer', id));
            self.questionOptions.removeAll();
            self.activeQuestion(false);
        };
        
        this.challengePlayer = function(userName) {
            webSocketClient.sendMessage(webSocketClient.createMessage('challenge', userName));
        };
        
    };
    
    return IndexViewModel;
});