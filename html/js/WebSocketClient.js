function WebSocketClient(onConnected, onMessage)
{
    var self = this;
    this.sendMessage = null;
    
    this.createMessage = function(messageType, messageData)
    {
        return JSON.stringify({'messageType': messageType, 'messageData' : messageData});
    }
    
    this.connect = function()
    {
        var ws = new WebSocket(config.socketURL);
        
        ws.onopen = function()
        {
            // Send a message to the server
            self.sendMessage = function(message)
            {
                ws.send(message);
            }
            
            onConnected && onConnected();
        }
        
        // Handle incoming messages
        ws.onmessage = function(socketMessage)
        {
            var message = JSON.parse(socketMessage.data);
            
            onMessage && onMessage(message);
        }
    }
};