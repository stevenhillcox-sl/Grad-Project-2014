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
    
    it("can find player names", function(){
        server.players = [{'userName': 'User1'}, {'userName': 'User2'}];
        var playerNames = server.getPlayerNames();
        expect(playerNames).toEqual(['User1', 'User2']);
    });
    
    it("will return an empty array if there are no players", function(){
        var playerNames = server.getPlayerNames();
        expect(playerNames.length).toBe(0);
    });
    
    it("can find a player associated with a socket", function(){
        var fakeSocket1 = { item: 'blah' };
        var fakeSocket2 = { item: 'foo' };
        server.players =  [{'userName': 'User1', 'socket': fakeSocket1}, {'userName': 'User2', 'socket': fakeSocket2}];
        var player = server.findPlayerBySocket(fakeSocket2);
        expect(player.userName).toBe('User2');
    });
    
    it("will return no player if a socket is not associated with one", function(){
        var fakeSocket = {};
        var player = server.findPlayerBySocket(fakeSocket);
        expect(player).toBe(undefined);
    });
});


