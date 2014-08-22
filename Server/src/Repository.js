function Repository(){
    
    var self = this;
    
    var MongoClient = require('mongodb').MongoClient;
    
    this.persistUser = null;
    this.getUser = null;
    this.addUser = null;
    
    MongoClient.connect('mongodb://127.0.0.1:27017/GameDB', function(err, db) {
        if(err) 
        { 
            throw err;
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
   
}

module.exports.Repository = Repository;