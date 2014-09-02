function WebServices(httpServer, lobby, repository) {
    
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
    
    httpServer.app.get('/clear', function(req, res) {
        repository.clearUsers();
    });
}

module.exports.WebServices = WebServices;