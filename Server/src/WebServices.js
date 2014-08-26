function WebServices(httpServer, lobby) {
    
    httpServer.app.get('/users', function(req, res) {
        res.send(lobby.clients.map( function(client) {
            return client.user.userName;
        }));
    }); 
}

module.exports.WebServices = WebServices;