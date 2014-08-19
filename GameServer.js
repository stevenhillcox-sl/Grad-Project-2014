function GameServer(server)
{
    //var server = require('./Server.js');
    var self = this;
    
    this.currentQuestionNumber = 0;
    this.playersAnswered = 0;
    
    this.questions = [
        { questionText : 'Is France a flavour?', questionOptions :  ['Yes', 'No', 'Maybe'], correctAnswer : 2 },
        //{ questionText : 'What is the capital of London?', questionOptions :  ['England', 'No', 'L'], correctAnswer : 2 },
        //{ questionText : 'What is love?', questionOptions :  ['Baby don\'t hurt me', 'Baby don\'t hurt me', 'No more'], correctAnswer : 1 },
        //{ questionText : 'Hablas Espanol?', questionOptions :  ['Si', 'Huh?', 'Oui'], correctAnswer : 0 },
        //{ questionText : 'What is the second derivative of ln(e^x)?', questionOptions :  ['1', 'x', '0'], correctAnswer : 2 },
        ];
    
    this.checkAnswer = function(answer, socket){
        
        var currentQuestion = self.questions[self.currentQuestionNumber];
        var correctAnswer = currentQuestion.correctAnswer;
        
        if (answer == currentQuestion.questionOptions[correctAnswer]) {
            socket.send(server.createMessage('info', 'Correct'));
        } else {
            socket.send(server.createMessage('info', 'Incorrect! The correct answer is: ' + currentQuestion.questionOptions[correctAnswer]));
        }
        
        self.playersAnswered ++;
        
        if(self.playersAnswered == server.players.length &&
            ++ self.currentQuestionNumber < self.questions.length) {
                self.playersAnswered = 0;
                //self.currentQuestionNumber ++;
                self.sendQuestion();
        } else if(self.currentQuestionNumber >= self.questions.length) {
            server.closeGame(self);
        }
    };
    
    this.sendQuestion = function() {
        // currentQuestionNumber ++;
        server.broadcastMessage(server.createMessage('question', this.questions[self.currentQuestionNumber].questionText));
        server.broadcastMessage(server.createMessage('questionOptions', this.questions[self.currentQuestionNumber].questionOptions));
    };
    
     // Send first question
    this.sendQuestion();
}

var module = module || {};
module.exports = module.exports || {};
module.exports.GameServer = GameServer;