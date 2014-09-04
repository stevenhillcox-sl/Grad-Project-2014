function HttpServer(){
    this.express = require('express');
    this.app = this.express();
    this.http = require('http').Server(this.app);

    var port = process.env.PORT = process.env.PORT || '8080';
	var ip = process.env.IP || '0.0.0.0';
    
    // Start listening for http requests
    this.http.listen(port, ip,  function(){
        console.log('Http server starting on port ' + port );
    });
        
    // Expose folder as a static webserver
    this.app.use(this.express.static(__dirname + "/../Client/build"));
}

module.exports.HttpServer = HttpServer;