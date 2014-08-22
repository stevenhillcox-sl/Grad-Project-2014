console.log('Server is starting');

// Requires
var hs = require('./HttpServer.js');
var wss = require('./WebSocketServer.js');
var l = require('./Lobby.js');
var r = require('./Repository.js');

var repository = new r.Repository();
var httpServer = new hs.HttpServer();
var webSocketServer = new wss.WebSocketServer(httpServer.http);
var lobby = new l.Lobby(webSocketServer);
