#!/bin/sh

ssh -tt azureuser@20.215.192.49 <<EOF
  git checkout fb-cicd
  git pull
  cd /home/azureuser/contest-platform/frontend
  pm2 restart pzsp2-frontend
  exit
EOF