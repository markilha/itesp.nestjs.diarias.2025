#!/bin/bash

set -e

LOG_FILE="build.log"
echo "Iniciando script: $(date)" >> $LOG_FILE

echo "Executando yarn build..." | tee -a $LOG_FILE
yarn build >> $LOG_FILE 2>&1

echo "Reiniciando aplicação no PM2..." | tee -a $LOG_FILE
pm2 restart 7 >> $LOG_FILE 2>&1

echo "Comandos executados com sucesso!" | tee -a $LOG_FILE

