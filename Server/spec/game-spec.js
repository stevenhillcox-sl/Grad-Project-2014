/* global describe, it, expect, beforeEach */
describe("Game", function() {
    var g = require('../Game.js').Game;

    var game;
    var webSocketServer;
    var httpServer;

    beforeEach(function() {
        webSocketServer = {};
        httpServer = {};

        webSocketServer.createSocketMessage = function(messageType, messageData) {
            return JSON.stringify({
                'messageType': messageType,
                'messageData': messageData
            });
        };
    });

    it("can broadcast to all current users in game", function() {
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

        game = new g(httpServer, webSocketServer, clients);

        game.broadcastToClients('Hello World!');

        expect(messages).toEqual(['Hello World!', 'Hello World!']);

    });

    it("can broadcast to all but one current user in game", function() {
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

        game = new g(httpServer, webSocketServer, clients);

        game.broadcastToAllClientsExcept('Hello World!', clients[1]);

        expect(messages).toEqual(['Hello World!']);

    });
});