/* global describe, it, expect, beforeEach */
describe("Game", function() {
    var g = require('../Game.js').Game;

    var game;
    var webSocketServer = {
        createSocketMessage: function(messageType, messageData) {
            return JSON.stringify({
                'messageType': messageType,
                'messageData': messageData
            });
        }
    };

    var closedGames = [];
    var httpServer = {
        closeGame: function(game) {
            closedGames.push(game);
        }
    };

    var messages = [];
    var mocket = {
        send: function(message) {
            messages.push(message);
        }
    };

    var clients = null;
    var client1 = {
        'socket': mocket
    };
    var client2 = {
        'socket': mocket
    };

    beforeEach(function() {
        messages = [];
        closedGames = [];

        clients = [client1, client2];
        game = new g(httpServer, webSocketServer, clients);
    });

    describe("broadcastToClients", function() {
        it("can broadcast to all current users in game", function() {
            game.broadcastToClients('Hello World!');

            expect(messages).toEqual(['Hello World!', 'Hello World!']);

        });
    });

    describe("broadcastToAllClientsExcept", function() {
        it("can broadcast to all but one current user in game", function() {
            game.broadcastToAllClientsExcept('Hello World!', clients[1]);

            expect(messages).toEqual(['Hello World!']);
        });
    });

    describe("handleMessage", function() {
        it("can handle end game requests from clients", function() {
            game.handleMessage("endGame");

            expect(messages).toEqual(['{"messageType":"gameClose","messageData":""}', '{"messageType":"gameClose","messageData":""}', '{"messageType":"endGame"}', '{"messageType":"endGame"}']);
        });
    });

    describe("killGame", function() {
        it("will end the game and remove the dropped client", function() {
            game.killGame(clients[0]);

            expect(game.clients.length).toBe(1);
            expect(game.clients[0].gameServer).toBeNull();
        });
    });

    describe("close", function() {
        it("will send a gameclose message to all clients and close the game", function(){
            game.close();

            expect(messages).toEqual([ '{"messageType":"gameClose","messageData":""}', '{"messageType":"gameClose","messageData":""}' ]);
            expect(closedGames.length).toBe(1);
            expect(closedGames[0]).toBe(game);
        });
    });
});