define([], function() {
    return function WebSocketClient(onConnected, onMessage, onClose) {
        var self = this;
        this.sendMessage = null;

        this.createMessage = function(messageType, messageData) {
            return JSON.stringify({
                'messageType': messageType,
                'messageData': messageData
            });
        };

        this.connect = function() {
            // var webSocket = new WebSocket("ws://" + window.location.hostname);
            var webSocket = new WebSocket("ws://grad-project-2014-dev-c9-shillcox.c9.io/");

            webSocket.onopen = function() {
                // Send a message to the server
                self.sendMessage = function(message) {
                    console.log("Sending", message);
                    webSocket.send(message);
                };

                onConnected && onConnected();
            };

            // Handle incoming messages
            webSocket.onmessage = function(socketMessage) {
                var message = JSON.parse(socketMessage.data);

                console.log("got", message);

                if (onMessage) {
                    onMessage(message);
                }
            };

            webSocket.onclose = function() {
                onClose && onClose();
            };
        };
    };
});