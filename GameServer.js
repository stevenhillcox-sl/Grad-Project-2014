function GameServer(server)
{
    //var server = require('./Server.js');
    var self = this;
    
    // Send first question
    server.broadcastMessage(server.createMessage('question', 'Is France a flavour?'));
    server.broadcastMessage(server.createMessage('questionOptions', ['Yes', 'No', 'Maybe']));
    
    this.checkAnswer = function(answer){
        // if (answer == "Maybe") {
            
        // }
        server.broadcastMessage(server.createMessage('question', 'What is the capital of London?'));
        server.broadcastMessage(server.createMessage('questionOptions', ['England', 'No', 'L']));
    }
}

module.exports.GameServer = GameServer;