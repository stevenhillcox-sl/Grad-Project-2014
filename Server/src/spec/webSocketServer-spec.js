/* global describe, it, expect, beforeEach */
describe("WebSocketServer", function() {
    var wss = require('../WebSocketServer.js').WebSocketServer;
    
    var webSocketServer;

    beforeEach(function(){
        webSocketServer = new wss();
    });
    
    it("can create a messsage", function() {
        var testMessage = webSocketServer.createSocketMessage('type', 'Hello World!');
        expect(testMessage).toBe('{"messageType":"type","messageData":"Hello World!"}');
    });
    
    it("can send messages to specific sockets", function() {
        var message = null;
        var mocket = { send : function(m) {
            message = m;
        }};
        
        var mockClient = {'socket': mocket};
        
        webSocketServer.sendMessage('Hello World!', mockClient);
        
        expect(message).toEqual('Hello World!');
    });
        
    
    it("broadcasts to sockets", function() {
        
        var messages = [];
        var clients =[];
        var sendFunction = function(message){
            messages.push(message);
        };
        
        var mocket = { send: sendFunction };
        var mockClient = {'socket' : mocket};
        
        clients.push(mockClient, mockClient, mockClient);
            
        webSocketServer.broadcastMessage('Hello', clients);
        expect(messages).toEqual(['Hello', 'Hello', 'Hello']);
    });
    
 
});

