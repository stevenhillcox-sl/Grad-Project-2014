# Shutdown node and mongo
pkill node
pkill mongod
# Start node and mongo
mongod -dbpath Server/data/db/ --smallfiles& 
node src/main &