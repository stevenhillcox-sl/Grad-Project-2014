function WebSocketServer(httpServer){
    
    var self = this;
    
    self.ws = require('ws').Server;
    
    self.onNewClient = null;
    self.onClientClose = null;
    self.onClientJoin = null;
    self.onMessage = null;
    self.onClientChallenge = null;
    
    // Start the web socket server
    self.startServer = function(){
        console.log("Websocket server starting");
        self.webSocketServer = new self.ws({'server' : httpServer});
        
        // Listen for socket connections
        self.webSocketServer.on('connection', function(socket) {
            
            // New client joins
            var newClient = {
                'socket' : socket,
                'user' : null,
                'game' : null
            };
            self.onNewClient(newClient);
                        
            // Set up handler for incoming messages
            socket.on('message', function(message) {
                self.handleMessage(message, socket);
            });
            
            // Handle socket closes
            socket.on('close', function(){
                
                // Client closes
                self.onClientClose(socket);
                
            });
        });
    };
    
    // Create a JSON message to be sent to the user
    self.createSocketMessage = function(messageType, messageData) {
        return JSON.stringify({'messageType': messageType, 'messageData' : messageData});
    };
    
    // Send a message to all clients
    self.broadcastMessage = function(message, clients)
    {
        clients.forEach(function(client)
        {
            client.socket.send(message);
        });
    };
    
    self.sendMessage = function(message, client){
        client.socket.send(message);
    };
    
    // Handle an incoming message
    self.handleMessage = function(socketMessage, socket) {
        var message = JSON.parse(""+socketMessage);
        var messageType = message.messageType;
        
        switch(messageType){
            case 'join':
                self.onClientJoin(socket, message.messageData);
                break;
            case 'challenge':
                self.onClientChallenge(socket, message.messageData);
                break;
            default:
                self.onMessage(socket, message);
                break;
        }
    };
}

module.exports.WebSocketServer = WebSocketServer;