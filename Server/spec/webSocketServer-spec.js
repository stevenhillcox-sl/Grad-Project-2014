/* global describe, it, expect, beforeEach */
describe("WebSocketServer", function() {
    var wss = require('../WebSocketServer.js').WebSocketServer;

    var webSocketServer;

    beforeEach(function() {
        webSocketServer = new wss();
    });

    describe("createSocketMessage", function() {
        it("can create a messsage", function() {
            var testMessage = webSocketServer.createSocketMessage('type', 'Hello World!');
            expect(testMessage).toBe('{"messageType":"type","messageData":"Hello World!"}');
        });
    });

    describe("broadcastMessage", function() {
        it("broadcasts to all sockets", function() {

            var messages = [];
            var clients = [];
            var sendFunction = function(message) {
                messages.push(message);
            };

            var mocket = {
                send: sendFunction
            };
            var mockClient = {
                'socket': mocket
            };

            clients.push(mockClient, mockClient, mockClient);

            webSocketServer.broadcastMessage('Hello', clients);
            expect(messages).toEqual(['Hello', 'Hello', 'Hello']);
        });
    });

    describe("sendMessage", function() {
        it("can send messages to specific sockets", function() {
            var message = null;
            var mocket = {
                send: function(m) {
                    message = m;
                }
            };

            var mockClient = {
                'socket': mocket
            };

            webSocketServer.sendMessage('Hello World!', mockClient);

            expect(message).toEqual('Hello World!');
        });
    });

    describe("handleMessage", function() {
        it("can handle join messages", function() {
            var methodCalled = false;
            webSocketServer.onClientJoin = function() {
                methodCalled = true;
            };

            var message = webSocketServer.createSocketMessage("join", "");
            webSocketServer.handleMessage(message);

            expect(methodCalled).toBe(true);
        });

        it("can handle challenge messages", function() {
            var methodCalled = false;
            webSocketServer.onClientChallenge = function() {
                methodCalled = true;
            };

            var message = webSocketServer.createSocketMessage("challenge", "");
            webSocketServer.handleMessage(message);

            expect(methodCalled).toBe(true);
        });

        it("can handle all other messages", function() {
            var methodCalled = false;
            webSocketServer.onMessage = function() {
                methodCalled = true;
            };

            var message = webSocketServer.createSocketMessage("test", "");
            webSocketServer.handleMessage(message);

            expect(methodCalled).toBe(true);
        });
    });

});