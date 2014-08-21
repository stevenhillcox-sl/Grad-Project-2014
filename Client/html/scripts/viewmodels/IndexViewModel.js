/* global ko GameClient WebSocketClient*/
function IndexViewModel() {
    // Create observables
    this.userName = ko.observable('User' + Math.floor(Math.random()*1000));
    this.serverMessages = ko.observableArray();
    this.players = ko.observableArray();
    this.questionOptions = ko.observableArray();
    this.selectedAnswer = ko.observable();
    this.gameActive = ko.observable(false);
    this.connected = ko.observable(false);
    this.activeQuestion = ko.observable(false);
    
    var self = this;

    //
    /// --> Server code
    //
    
    // Display information messages to the user
    var onMessage = function(message){
        switch(message.messageType) {
            case 'playerInfo':
                self.players(message.messageData);
                break;
            case 'questionOptions':
                self.questionOptions.removeAll();
                self.questionOptions(message.messageData);
                self.activeQuestion(true);
                break;
            case 'gameStart':
                self.gameActive(true);
                break;
            case 'gameClose':
                self.gameActive(false);
                self.players.removeAll();
                break;
            case 'question':
            case 'info':
                self.serverMessages.unshift(message.messageData);
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
    
    this.sendAnswer = function() {
        webSocketClient.sendMessage(webSocketClient.createMessage('answer', self.selectedAnswer()));
        self.questionOptions.removeAll();
        self.activeQuestion(false);
    };
}

$(function(){
    ko.applyBindings(new IndexViewModel());
});