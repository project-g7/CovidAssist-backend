#!/bin/bash
sudo chmod -R 777 /home/ec2-user/express-app

cd /home/ec2-user/express-app

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" 
[ -s "$NVM_DIR/bash_completion"] && \. "$NVM_DIR/bash_completion"

npm install

node index.js > index.out.log 2> index.err.log < /dev/null &