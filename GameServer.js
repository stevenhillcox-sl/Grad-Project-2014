function GameServer(server, clients)
{
    var self = this;
    
    this.currentQuestionNumber = 0;
    this.playersAnswered = 0;
    
    this.broadcastToClients = function(message){
        clients.forEach(function(client){
            client.socket.send(message);
        });
    };
    
    this.handleMessage = function(message, messageType, client) {
        if(messageType == 'answer'){
            this.checkAnswer(message.messageData, client);
        }
    };
    
    this.getUserNames = function(){
        var userNames = [];
        clients.forEach(function(client){
            client.user && userNames.push(client.user.userName);
        });
        return userNames;
    };
    
    this.questions = [
        { questionText : 'Is France a flavour?', questionOptions :  [{'id' : 0, 'text' : 'Yes'}, {'id' : 1, 'text' : 'No'}, {'id' : 2, 'text' : 'Maybe'}], correctAnswerId : 2 },
        { questionText : 'What is the capital of London?', questionOptions :  [{'id' : 0, 'text' : 'England'}, {'id' : 1, 'text' : 'No'}, {'id' : 2, 'text' : 'L'}], correctAnswerId : 2 }
        //{ questionText : 'What is love?', questionOptions :  ['Baby don\'t hurt me', 'Baby don\'t hurt me', 'No more'], correctAnswer : 1 },
        //{ questionText : 'Hablas Espanol?', questionOptions :  ['Si', 'Huh?', 'Oui'], correctAnswer : 0 },
        //{ questionText : 'What is the second derivative of ln(e^x)?', questionOptions :  ['1', 'x', '0'], correctAnswer : 2 },
        ];
    
    this.checkAnswer = function(answer, client){
        
        var currentQuestion = self.questions[self.currentQuestionNumber];
        var correctAnswerId = currentQuestion.correctAnswerId;
        
        if (answer == currentQuestion.correctAnswerId) {
            client.socket.send(server.createMessage('info', 'Correct'));
        } else {
            client.socket.send(server.createMessage('info', 'Incorrect! The correct answer is: ' + currentQuestion.questionOptions[correctAnswerId].text));
        }
        
        self.playersAnswered ++;
        
        if(self.playersAnswered == clients.length &&
            ++ self.currentQuestionNumber < self.questions.length) {
                self.playersAnswered = 0;
                self.sendQuestion();
        } else if(self.currentQuestionNumber >= self.questions.length) {
            //server.closeGame(self);
            self.close();
        }
    };
    
    this.sendQuestion = function() {
        self.broadcastToClients(server.createMessage('question', this.questions[self.currentQuestionNumber].questionText));
        self.broadcastToClients(server.createMessage('questionOptions', this.questions[self.currentQuestionNumber].questionOptions));
    };
    
    this.start = function(){
        // Send first question
        self.broadcastToClients(server.createMessage('gameStart', ''))
        self.broadcastToClients(server.createMessage('info', 'The Game is starting'));
        self.broadcastToClients(server.createMessage('playerInfo', self.getUserNames()));
        this.sendQuestion();
    };
    
    this.killGame = function(droppedClient)
    {
        console.log("Game being killed");
        // Remove the dropped client from our client list
        clients.splice(clients.indexOf(droppedClient), 1);
        // Push the remaining clients back to the queue
        clients.forEach(function(client){
            server.clientQueue.push(client);
        });
        
        // Close the game
        self.close();
    }
    
    this.close = function() {
        // Send closing down message to all clients
        self.broadcastToClients(server.createMessage('info', 'Game is closing'));
        self.broadcastToClients(server.createMessage('gameClose', ''));
    };
}

var module = module || {};
module.exports = module.exports || {};
module.exports.GameServer = GameServer;