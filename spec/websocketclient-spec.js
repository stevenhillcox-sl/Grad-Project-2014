/* global describe, it, expect, beforeEach */
describe("WebSocketClient", function() {
    var c = require('../html/scripts/WebSocketClient.js').WebSocketClient;
    var client;
    
    beforeEach(function(){
        client = new c();
    });
    
    it("can create a messsage", function(){
        var testMessage = client.createMessage('type', 'Hello World!');
        expect(testMessage).toBe('{"messageType":"type","messageData":"Hello World!"}'); 
    });
});