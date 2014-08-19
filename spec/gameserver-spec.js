/* global describe, it, expect, beforeEach */
describe ("Game Server", function() {
    var gs = require('../GameServer.js').GameServer;
    var s = require('../Server.js').Server;
    
    var gameServer;
    var server;
    
    beforeEach(function() {
        server = new s();
        gameServer = new gs(server);
    });
    
    // FINISH THIS
    it("can verify if an answer is correct for the first question", function() {
        
        var responseMessage;
       // var playersAnswred = 0;
        
        var socket = {send: function(message) {
            responseMessage = message;
        }};
        gameServer.checkAnswer('Maybe', socket);
        
        expect(responseMessage).toBe('{"messageType":"info","messageData":"Correct"}');
        expect(gameServer.currentQuestionNumber).toBe(0);
        expect(gameServer.playersAnswered).toBe(1);
    });
    
     it("can verify if an answer is incorrect for the first question", function() {
        
        var responseMessage;
       // var playersAnswred = 0;
        
        var socket = {send: function(message) {
            responseMessage = message;
        }};
        gameServer.checkAnswer('No', socket);
        
        expect(responseMessage).toBe('{"messageType":"info","messageData":"Incorrect! The correct answer is: Maybe"}');
        expect(gameServer.currentQuestionNumber).toBe(0);
        expect(gameServer.playersAnswered).toBe(1);
    });
    
    it("can proceeed to the next question when all players have answered", function() {
        
        var responseMessage;
        var questionsSent = false;
        
        var socket = {send: function(message) {
            responseMessage = message;
        }};
        
        var sendQuestionfunction = function(){
            questionsSent = true;
        }
        
        gameServer.sendQuestion = sendQuestionfunction;
        
        server.players.push({}, {});
        gameServer.checkAnswer('Maybe', socket);
        
        gameServer.checkAnswer('No', socket);
        
        expect(gameServer.currentQuestionNumber).toBe(1);
        expect(gameServer.playersAnswered).toBe(0);
        expect(questionsSent).toBeTruthy();
    });
});