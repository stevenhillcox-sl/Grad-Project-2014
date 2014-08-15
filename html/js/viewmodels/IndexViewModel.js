/* global ko GameClient WebSocketClient*/
function IndexViewModel() {
    // Create observables
    this.userName = ko.observable('User' + Math.floor(Math.random()*1000));
    this.serverMessages = ko.observableArray();
    //this.connectionStatus = ko.observable();
    
    var self = this;

    //
    /// --> Server code
    //
    
    // Display information messages to the user
    var onMessage = function(message)
    {
        self.serverMessages.unshift(message.messageData);
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
};

$(function(){
    ko.applyBindings(new IndexViewModel());
});