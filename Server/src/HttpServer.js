function HttpServer(){
    this.express = require('express');
    this.app = this.express();
    this.http = require('http').Server(this.app);
    
    // Start listening for http requests
    this.http.listen(process.env.PORT, process.env.IP,  function(){
        console.log('Http server starting on port ' + process.env.PORT );
    });
        
    // Expose html folder as a static webserver
    this.app.use(this.express.static("/home/ubuntu/workspace/Client/html"));
}

module.exports.HttpServer = HttpServer;