function Repository(){
    
    var self = this;
    
    var MongoClient = require('mongodb').MongoClient;
    
    this.persistUser = null;
    this.getUser = null;
    this.addUser = null;
    
    this.connect = function(){
    
        MongoClient.connect('mongodb://127.0.0.1:27017/GameDB', function(err, db) {
            
            if(err) 
            { 
                setTimeout(self.start, 10000);
                console.log('Failed to commect to db');
                console.log('Trying again in 10 seconds');
                return;
            }
            
            console.log('Connected to db');
            
            self.addUser = function(user, callBack){
                db.collection('Users').insert(user, function(err, records){
                    callBack(records);
                });
            };
            
            self.getUser = function(userName){
                return (db.collection('Users').find({'userName' : userName}));
            };
            
            self.persistUser = function(user, callBack){
                db.collection('Users').update({'userName' : user.userName}, user, {upsert: true}, function(err, record){
                   callBack(record); 
                });
            };
       });
    };
    
    this.connect();
}

module.exports.Repository = Repository;