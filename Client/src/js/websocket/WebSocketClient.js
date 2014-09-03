define([], function(){
    var WebSocketClient = function(onConnected, onMessage, onClose) {
        var self = this;
        this.sendMessage = null;
        
        this.createMessage = function(messageType, messageData)
        {
            return JSON.stringify({'messageType': messageType, 'messageData' : messageData});
        };
        
        this.connect = function()
        {
            var webSocket = new WebSocket("ws://"+window.location.hostname);                                      
            
            webSocket.onopen = function()
            {
                // Send a message to the server
                self.sendMessage = function(message)
                {
                    webSocket.send(message);
                };
                
                onConnected && onConnected();
            };
            
            // Handle incoming messages
            webSocket.onmessage = function(socketMessage)
            {
                var message = JSON.parse(socketMessage.data);
                
                onMessage && onMessage(message);
            };
            
            webSocket.onclose = function()
            {
                onClose && onClose();
            };
        };
    };
    
    return WebSocketClient;
});