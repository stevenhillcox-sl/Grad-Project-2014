define([], function() {
    return function WebSocketClient(onConnected, onMessage, onClose) {

        var self = this;
        self.sendMessage = null;

        // Creates a correctly formatted JSON message
        this.createMessage = function(messageType, messageData) {
            return JSON.stringify({
                'messageType': messageType,
                'messageData': messageData
            });
        };

        // Connect to the web socket
        this.connect = function() {
            var webSocket = new WebSocket("ws://" + window.location.hostname + (window.location.hostname == "localhost" ? ":8080" : ""));

            webSocket.onopen = function() {
                // Send a message to the server
                self.sendMessage = function(message) {
                    
                    webSocket.send(message);
                };

                if(onConnected){
                    onConnected();
                }
            };

            // Handle incoming messages
            webSocket.onmessage = function(socketMessage) {
                var message = JSON.parse(socketMessage.data);

                if (onMessage) {
                    onMessage(message);
                }
            };

            // Handle disconnects
            webSocket.onclose = function() {
                if(onClose){
                    onClose();
                }
            };
        };
    };
});