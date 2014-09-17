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
    var httpServer = {
        closeGame: function() {}
    };

    var messages = [];
    var mocket = {
        send: function(message) {
            messages.push(message);
        }
    };

    var clients = [{
        'socket': mocket
    }, {
        'socket': mocket
    }];

    beforeEach(function() {
        messages = [];
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
});