taskkill /IM mongod.exe /F
taskkill /IM node.exe /F
START /B C:\"Program Files"\"MongoDB 2.6 Standard"\bin\mongod.exe -dbpath Server/data/db/
START /B node Server/main