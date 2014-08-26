function WebServices(httpServer, lobby) {
    
    httpServer.app.get('/users', function(req, res) {
        res.send(lobby.clients.map( function(client) {
            return {userName: client.user.userName,
                    inGame: client.gameServer === null ? 'Challenge' : 'In-Game'
            };
        }));
    });
};

module.exports.WebServices = WebServices;