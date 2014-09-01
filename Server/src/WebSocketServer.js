function WebSocketServer(httpServer){
    
    var self = this;
    
    this.ws = require('ws').Server;
    
    this.onNewClient = null;
    this.onClientClose = null;
    this.onClientJoin = null;
    this.onMessage = null;
    this.onClientChallenge = null;
    
    // Start the web socket server
    this.startServer = function(){
        console.log("Websocket server starting");
        this.webSocketServer = new this.ws({'server' : httpServer});
        
             // Listen for socket connections
        this.webSocketServer.on('connection', function(socket) {
            
            // New client joins
            var newClient = {
                'socket' : socket,
                'user' : null,
                'game' : null
            };
            self.onNewClient(newClient);
            
            // Send a success message to the client
            socket.send(self.createSocketMessage('info', 'Connected'));
            
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
    this.createSocketMessage = function(messageType, messageData) {
        return JSON.stringify({'messageType': messageType, 'messageData' : messageData});
    };
    
    // Send a message to all clients
    this.broadcastMessage = function(message, clients)
    {
        clients.forEach(function(client)
        {
            client.socket.send(message);
        });
    };
    
    this.sendMessage = function(message, client){
        client.socket.send(message);
    };
    
    // Handle an incoming message
    this.handleMessage = function(socketMessage, socket) {
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
        }
    };
}

module.exports.WebSocketServer = WebSocketServer;