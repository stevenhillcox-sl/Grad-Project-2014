/* global describe, it, expect */
describe("Server ", function() {
    var s = require('../Server.js').Server;
    var server;

    beforeEach(function(){
        server = new s();
    });
    
    it("can create a messsage", function() {
        var testMessage = server.createMessage('type', 'Hello World!');
        expect(testMessage).toBe('{"messageType":"type","messageData":"Hello World!"}');
    });
    
    it("broadcast to sockets", function() {
        
        var messages = []
        var sendFunction = function(message){
            messages.push(message);
        }
        
        server.sockets = [
                { send: sendFunction },
                { send: sendFunction },
                { send: sendFunction }
            ];
            
        server.broadcastMessage('Hello');
        expect(messages).toEqual(['Hello', 'Hello', 'Hello']);
        
        // var testMessage = server.createMessage('type', 'Hello World!');
        // expect(testMessage).toBe('{"messageType":"type","messageData":"Hello World!"}');
        
        
    });
    
    it("is constructed with no sockets", function() {
        expect(server.sockets.length).toBe(0);
    });
});

