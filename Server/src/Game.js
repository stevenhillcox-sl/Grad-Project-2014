function Game(server, webSocketServer, clients)
{
    var self = this;
    
    this.currentQuestionNumber = 0;
    this.playersAnswered = 0;
    this.scores = [];
    this.clients = clients;
    
    this.questions = [
        { questionText : 'Is France a flavour?', questionOptions :  [{'id' : 0, 'text' : 'Yes'}, {'id' : 1, 'text' : 'No'}, {'id' : 2, 'text' : 'Maybe'}], correctAnswerId : 2 },
        { questionText : 'What is the capital of London?', questionOptions :  [{'id' : 0, 'text' : 'England'}, {'id' : 1, 'text' : 'No'}, {'id' : 2, 'text' : 'L'}], correctAnswerId : 2 },
        { questionText : 'What is love?', questionOptions :  [{'id' : 0, 'text' : 'Baby don\'t hurt me'}, {'id' : 1, 'text' : 'Baby don\'t hurt me'}, {'id' : 2, 'text' : 'No more'}], correctAnswerId : 1 },
        { questionText : 'Hablas Espanol?', questionOptions :  [{'id' : 0, 'text' : 'Si'}, {'id' : 1, 'text' : 'Huh?'}, {'id' : 2, 'text' : 'Oui'}], correctAnswerId : 0 },
        { questionText : 'What is the second derivative of ln(e^x)?', questionOptions :  [{'id' : 0, 'text' : '1'}, {'id' : 1, 'text' : 'x'}, {'id' : 2, 'text' : '0'}], correctAnswerId : 2 },
    ];
    
    // Sends a message to all game clients
    this.broadcastToClients = function(message){
        
        self.clients.forEach(function(client){
            client.socket.send(message);
        });
    };
    
    // Sends a message to all game clients except one
    this.broadcastToAllClientsExcept = function(message, exceptedClient){
        
        self.clients.forEach(function(client){
            if(client != exceptedClient){
                client.socket.send(message);
            }
        });
    };
    
    // Handles incoming messages
    this.handleMessage = function(message, messageType, client) {
        
        if(messageType == 'answer'){
            this.checkAnswer(message.messageData, client);
        }
    };
    
    // Gets a list of usernames for the game clients
    this.getUserNames = function(){
        
        var userNames = [];
        self.clients.forEach(function(client){
            client.user && userNames.push(client.user.userName);
        });
        return userNames;
    };
    
    // Gets a score associates with a client
    this.getScoreByClient = function(client){
         return self.scores.filter(function(score){
           return score.client == client;
        })[0];
    };
    
    // Checks an answer and updates scores as required
    this.checkAnswer = function(answer, client){
        
        var currentQuestion = self.questions[self.currentQuestionNumber];
        var correctAnswerId = currentQuestion.correctAnswerId;
        
        if (answer == currentQuestion.correctAnswerId) {
            client.socket.send(webSocketServer.createSocketMessage('info', 'Correct'));
            self.getScoreByClient(client).value ++;
        } else {
            client.socket.send(webSocketServer.createSocketMessage('info', 'Incorrect! The correct answer is: ' + currentQuestion.questionOptions[correctAnswerId].text));
        }
        
        self.playersAnswered ++;
        
        if(self.playersAnswered == self.clients.length &&
            ++ self.currentQuestionNumber < self.questions.length) {
                
                self.playersAnswered = 0;
                self.sendQuestion();
        } else if(self.currentQuestionNumber >= self.questions.length) {
            
            self.endGame();
        }
    };
    
    // Sends the current question to all game participants
    this.sendQuestion = function() {
        self.broadcastToClients(webSocketServer.createSocketMessage('question', this.questions[self.currentQuestionNumber].questionText));
        self.broadcastToClients(webSocketServer.createSocketMessage('questionOptions', this.questions[self.currentQuestionNumber].questionOptions));
    };
    
    // Starts the game
    this.start = function(){
        
        // Set up scores
        self.clients.forEach(function(client){
            self.scores.push({'value' : 0, 'client' : client});
        });
        
        // Send first question
        self.broadcastToClients(webSocketServer.createSocketMessage('gameStart', ''));
        self.broadcastToClients(webSocketServer.createSocketMessage('info', 'The Game is starting'));
        self.broadcastToClients(webSocketServer.createSocketMessage('playerInfo', self.getUserNames()));
        this.sendQuestion();
    };
    
    // Ends the game and display the scores
    this.endGame = function(){
        
        var possibleTie = true;
        var highestScore = self.scores[0];
        
        self.scores.forEach(function(score){
           score.client.socket.send(webSocketServer.createSocketMessage('info', 'Your score: ' + score.value));
           if(score.value != highestScore.value){
               possibleTie = false;
               if(score.value > highestScore.value){
                   highestScore = score;
               }
           }
        });
        
        if(possibleTie) {
            self.broadcastToClients(webSocketServer.createSocketMessage('info', 'Draw'));
        } else {
            highestScore.client.socket.send(webSocketServer.createSocketMessage('info', 'You win'));
            self.broadcastToAllClientsExcept(webSocketServer.createSocketMessage('info', 'You lose'), highestScore.client);
        }
        self.close();
    }
    
    // Kill off a game if there are not enough players
    this.killGame = function(droppedClient){
        
        // Remove the dropped client from our client list
        self.clients.splice(self.clients.indexOf(droppedClient), 1);
        
        // Push the remaining clients back to the queue
        self.clients.forEach(function(client){
            
            client.gameServer = null;
            server.addToQueue(client);
        });
        
        // Close the game
        self.close();
    }
    
    // Closes off the game
    this.close = function() {
        
        // Send closing down message to all clients
        self.broadcastToClients(webSocketServer.createSocketMessage('gameClose', ''));
        
        server.closeGame(self);
    };
}

module.exports.Game = Game;