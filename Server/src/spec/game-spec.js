/* global describe, it, expect, beforeEach */
describe ("Game", function() {
    var gs = require('../Game.js').Game;
    var s = require('../Server.js').Server;
    
    var gameServer;
    var server;
    
    beforeEach(function() {
        server = new s();
        gameServer = new gs(server);
    });
    
    it("can verify a correct answer", function() {
        var responseMessages = [];
        var socket = {send: function(message) {
            responseMessages.push(message);
        }};
        var client = {'socket': socket};
        gameServer.clients = [client];
        gameServer.scores.push({'value' : 0, 'client' : client});
        
        gameServer.checkAnswer('2', client);
        
        expect(responseMessages[0]).toBe('{"messageType":"info","messageData":"Correct"}');
        expect(gameServer.currentQuestionNumber).toBe(1);
        expect(gameServer.playersAnswered).toBe(0);
    });
    
    it("can correctly identify an incorrect answer", function() {
        
        var responseMessages = [];
        var socket = {send: function(message) {
            responseMessages.push(message);
        }};
        var client = {'socket': socket};
        gameServer.clients = [client];
        gameServer.scores.push({'value' : 0, 'client' : client});
        
        gameServer.checkAnswer('1', client);
        
        expect(responseMessages[0]).toBe('{"messageType":"info","messageData":"Incorrect! The correct answer is: Maybe"}');
        expect(gameServer.currentQuestionNumber).toBe(1);
        expect(gameServer.playersAnswered).toBe(0);
    });
});