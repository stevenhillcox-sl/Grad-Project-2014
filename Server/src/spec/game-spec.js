/* global describe, it, expect, beforeEach */
describe ("Game", function() {
    var g = require('../Game.js').Game;
    
    var game;
    var webSocketServer;
    var httpServer;
    
    beforeEach(function() {
        webSocketServer = {};
        httpServer = {};
        
        webSocketServer.createSocketMessage = function(messageType, messageData){
            return JSON.stringify({'messageType': messageType, 'messageData' : messageData});
        };
    });
        
    it("can broadcast to all current users in game", function() {
        var messages = [];
        var mocket = {send: function(message){
            messages.push(message);
        }}
        var clients = [{'socket': mocket}, {'socket': mocket}];
        
        game = new g(httpServer,webSocketServer, clients);
        
        game.broadcastToClients('Hello World!');
        
        expect(messages).toEqual(['Hello World!', 'Hello World!'])
        
    });
    
    it("can broadcast to all but one current user in game", function() {
        var messages = [];
        var mocket = {send: function(message){
            messages.push(message);
        }}
        var clients = [{'socket': mocket}, {'socket': mocket}];
        
        game = new g(httpServer,webSocketServer, clients);
        
        game.broadcastToAllClientsExcept('Hello World!', clients[1]);
        
        expect(messages).toEqual(['Hello World!'])
        
    });
    
    it("can get a given user's score", function() {
        var client1 = {userName: 'client1'};
        var client2 = {userName: 'client2'};
        var clients = [client1, client2];
        game = new g(httpServer,webSocketServer, clients);
        
        game.scores = [{'value': 3,
                        'client': client1},
                       {'value': 5,
                        'client': client2}];
        
        var score = game.getScoreByClient(client1);
        
        expect(score).toBe(game.scores[0]);
    })
    
    it("can verify a correct answer", function() {
        var responseMessages = [];
        var socket = {send: function(message) {
            responseMessages.push(message);
        }};
        var client = {'socket': socket};
        var clients = [client];
        
        game = new g(httpServer,webSocketServer, clients);
        
        game.scores.push({'value' : 0, 'client' : client});
        
        game.checkAnswer('2', client);
        
        expect(responseMessages[0]).toBe('{"messageType":"info","messageData":"Correct"}');
        expect(game.currentQuestionNumber).toBe(1);
        expect(game.playersAnswered).toBe(0);
    });
    
    it("can correctly identify an incorrect answer", function() {
        
        var responseMessages = [];
        var socket = {send: function(message) {
            responseMessages.push(message);
        }};
        var client = {'socket': socket};
        var clients = [client];
        game = new g(httpServer,webSocketServer, clients);
        game.scores.push({'value' : 0, 'client' : client});
        
        game.checkAnswer('1', client);
        
        expect(responseMessages[0]).toBe('{"messageType":"info","messageData":"Incorrect! The correct answer is: Maybe"}');
        expect(game.currentQuestionNumber).toBe(1);
        expect(game.playersAnswered).toBe(0);
    });
    
    it("ends the game and displays the result", function() {
        var messages = [];
        var mocket = {send: function(message) {
            messages.push(message);
        }};
        var client1 = {socket: mocket};
        var client2 = {socket: mocket};
        var clients = [client1, client2];
        var server = {};
        
        httpServer.closeGame = function(thing){};
        
        game = new g(httpServer,webSocketServer, clients);
        game.close = function() {};
        
        game.scores = [{value: 4, client: client1}, 
                       {value: 2, client: client2}
                        ];
        
        game.endGame();        
        
        expect(messages).toEqual(['{"messageType":"info","messageData":"Your score: 4"}', '{"messageType":"info","messageData":"Your score: 2"}', '{"messageType":"info","messageData":"You win"}', '{"messageType":"info","messageData":"You lose"}']);
    
        game.scores = [{value: 3, client: client1}, 
                       {value: 3, client: client2}
                        ];
        messages.splice(0, messages.length);         
        game.endGame();
                        
        expect(messages).toEqual(['{"messageType":"info","messageData":"Your score: 3"}', '{"messageType":"info","messageData":"Your score: 3"}', '{"messageType":"info","messageData":"Draw"}', '{"messageType":"info","messageData":"Draw"}']);
               
    });
});