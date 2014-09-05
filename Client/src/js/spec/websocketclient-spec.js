/* global describe, it, expect, beforeEach */
define(['../websocket/WebSocketClient'], function(WebSocketClient){
	describe("WebSocketClient", function() {
		//var c = require('../websocket/WebSocketClient.js').WebSocketClient;
		var client;

		beforeEach(function() {
			client = new WebSocketClient();
		});

		it("can create a messsage", function() {
			var testMessage = client.createMessage('type', 'Hello World!');
			expect(testMessage).toBe('{"messageType":"type","messageData":"Hello World!"}');
		});
	});
});
