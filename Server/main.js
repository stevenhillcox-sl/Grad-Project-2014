console.log('Server is starting');

// Requires
var hs = require('./HttpServer.js');
var wss = require('./WebSocketServer.js');
var l = require('./Lobby.js');
var webS = require('./WebServices.js');
var r = require('./Repository.js');


var httpServer = new hs.HttpServer();

var webSocketServer = new wss.WebSocketServer(httpServer.http);
webSocketServer.startServer();

var repository = new r.Repository();
repository.connect();

var lobby = new l.Lobby(webSocketServer, repository);



var webServices = new webS.WebServices( httpServer, lobby, repository);