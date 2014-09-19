function WebServices(httpServer, lobby, repository) {
    
    // get routes
    httpServer.app.get('/users', function(req, res) {
        res.send(lobby.clients.map( function(client) {
            return {userName: client.user.userName,
                    inGame: client.game === null ? false : true
            };
        }));
    });
    
    httpServer.app.get('/stats', function(req, res) {
       repository.getLeaderboard( function(databaseUsers) {
            res.send(databaseUsers); 
       });
    });
    
    
    httpServer.app.get('/stats/:userName', function(req, res) {
        repository.getUser(req.params.userName, function(databaseUser) {
            res.send('Stats for ' + req.params.userName + ': ' + JSON.stringify({'Games Played': databaseUser.gamesPlayed, 
                                                                                 'Games Won' : databaseUser.wins}));
        });
    });
    
    httpServer.app.get('/health', function( req, res) {
        res.send('<p>Number of active connections: ' + lobby.clients.length + '</p><p> Server has been running for: ' + httpServer.uptime() + ' seconds.</p>');
    });
    

    //post routes
    httpServer.app.post('/stats/:userName/:winIncrement', function( req, res) {
        var user = lobby.getClientByUserName(req.params.userName).user;
        user.wins += Number(req.params.winIncrement);
        repository.persistUser(user, function() {
            lobby.promptLeaderBoard();
            res.send('RESPONSE');
        });
    });
}

module.exports.WebServices = WebServices;