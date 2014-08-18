/* global ko GameClient WebSocketClient*/
function IndexViewModel() {
    // Create observables
    this.userName = ko.observable('User' + Math.floor(Math.random()*1000));
    this.serverMessages = ko.observableArray();
    this.players = ko.observableArray();
    this.questionOptions = ko.observableArray();
    this.selectedAnswer = ko.observable();
    this.gameAcive = ko.observable(false);
    //this.connectionStatus = ko.observable();
    
    var self = this;

    //
    /// --> Server code
    //
    
    // Display information messages to the user
    var onMessage = function(message)
    {
        switch(message.messageType) {
            case 'playerInfo':
                self.players(message.messageData);
                break;
            case 'questionOptions':
                self.questionOptions.removeAll()
                self.questionOptions(message.messageData);
                break;
            case 'question':
            case 'info':
                self.serverMessages.unshift(message.messageData);
                break;
        }
    };
    var onConnected = function()
    {
        // Start the game
        var joinMessage = webSocketClient.createMessage('join', self.userName());
        webSocketClient.sendMessage(joinMessage);
    };
    
    var webSocketClient = new WebSocketClient(onConnected, onMessage);
    
    this.connectWebSocket = function() 
    {
        webSocketClient.connect();
    };
    
    this.sendAnswer = function()
    {
        // console.log(self.selectedAnswer());
        webSocketClient.sendMessage(webSocketClient.createMessage('answer', self.selectedAnswer()));
    }
};

$(function(){
    ko.applyBindings(new IndexViewModel());
});