/* global ko*/
function IndexViewModel() {
    this.userName = ko.observable('User' + Math.floor(Math.random()*1000));
    this.connectionStatus = ko.observable();
    
    var self = this;
    var webSocketClient = new WebSocketClient();
    
    webSocketClient.onConnected = function()
    {
        self.connectionStatus("Connected");
    }
    
    this.connectWebSocket = function() {
        webSocketClient.connect();
    }
};

$(function(){
    ko.applyBindings(new IndexViewModel());
});