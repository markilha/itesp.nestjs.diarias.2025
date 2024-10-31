# Usa a imagem Oracle Database 19c
FROM oracle/database:19.3.0-ee

# Define variáveis de ambiente
ENV ORACLE_SID=ORCLCDB \
    ORACLE_PDB=ORCLPDB1 \
    ORACLE_PWD=YourPassword123

# Expõe as portas para acesso ao banco de dados
EXPOSE 1521 5500

# Copia arquivos de inicialização, se necessário
# COPY ./init.sql /opt/oracle/scripts/setup/  

# Define o comando de inicialização
CMD ["/bin/sh", "-c", "/opt/oracle/runOracle.sh"]
