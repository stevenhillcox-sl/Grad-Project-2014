# Shutdown node and mongo
pkill node
pkill mongod
# Install node packages
npm install
# Create database directory if needed
if ! [ -d "data/db" ]; then 
    mkdir -p data/db;
    
fi 
# Start node and mongo

mongod -dbpath data/db/ --smallfiles& 
node src/main &