// Requires
var app = require('express')();
var http = require('http').Server(app);

// Serve the index page
app.get('/', function(req, res){
    res.sendfile('index.html');
});

http.listen(process.env.PORT, process.env.IP, function(){
    console.log('Server starting on port ' + process.env.PORT );
});