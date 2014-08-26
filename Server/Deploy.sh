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
nohup mongod -dbpath data/db/ --smallfiles >/dev/null & 
nohup node src/main >/dev/null &