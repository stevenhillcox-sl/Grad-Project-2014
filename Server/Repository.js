function Repository(){
    
    var self = this;
    
    var MongoClient = require('mongodb').MongoClient;
    
    this.persistUser = null;
    this.addUser = function() {};
    this.getUser = function() {};
    
    this.connect = function(){
    
        MongoClient.connect('mongodb://127.0.0.1:27017/GameDB', function(err, db) {
            
            if(err) 
            { 
                setTimeout(self.connect, 5000);
                console.log(err.message);
                console.log('Trying again in 10 seconds');
                return;
            }
            
            console.log('Connected to db');
            
            self.addUser = function(user, callBack){
                console.log(user);
                db.collection('Users').insert(user, function(err, records){
                    if (callBack) {
                        callBack(records);
                    }
                });
                console.log(user);
            };
            
            self.getLeaderboard = function(callback) {
                db.collection('Users').find(function(err, records) {
                    records.sort({'winPercentage' : -1}).toArray(function(err, array) {
                       callback(array); 
                    });
                });
            };
            
            self.getUser = function(userName, callback){
                db.collection('Users').findOne({'userName' : userName}, function(err, records) {
                     if (callback) {
                        callback(records);
                    }
                });
            };
            
            self.persistUser = function(user, callback){
                //BIT ODD HAVING THIS HERE
                user.winPercentage = 100 * user.wins / user.gamesPlayed;
                db.collection('Users').update({'userName' : user.userName}, user, function(err, records){
                    if (callback) {
                        callback(records); 
                    }
                });
            };
            
       });
    };
}

module.exports.Repository = Repository;