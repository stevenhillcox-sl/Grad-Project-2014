/* global describe, it, expect, beforeEach */
describe("Server", function() {
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
        
        var messages = [];
        var sendFunction = function(message){
            messages.push(message);
        };
        
        var mocket = { send: sendFunction };
        var mockClient = {'socket' : mocket};
        
        server.clients.push(mockClient, mockClient, mockClient);
            
        server.broadcastMessage('Hello');
        expect(messages).toEqual(['Hello', 'Hello', 'Hello']);
    });
    
    it("is constructed with no clients", function() {
        expect(server.clients.length).toBe(0);
    });
    
    it("can find a client associated with a socket", function(){
        var fakeSocket1 = { item: 'blah' };
        var fakeSocket2 = { item: 'foo' };
        server.clients =  [{'user': {'userName': 'User1'}, 'socket': fakeSocket1}, {'user': {'userName': 'User2'}, 'socket': fakeSocket2}];
        var client = server.getClientBySocket(fakeSocket2);
        expect(client.user.userName).toBe('User2');
    });
    
    it("will return no player if a socket is not associated with one", function(){
        var fakeSocket = {};
        var client = server.getClientBySocket(fakeSocket);
        expect(client).toBe(undefined);
    });
});

