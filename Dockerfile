# Use a imagem oficial do Node.js como base
FROM node:latest

# Define o diretório de trabalho no contêiner
WORKDIR /usr/src/api

# Copia o package.json e o package-lock.json para o diretório de trabalho
COPY . .

# Instala as dependências do projeto
RUN npm install

# Copia o restante do código da aplicação para o diretório de trabalho
COPY . .

COPY ./.env.production ./.env

# Compila o código TypeScript para JavaScript

RUN npm install --quiet --no-optional --no-fund --loglevel=error
RUN npm run build

# Expõe a porta que a aplicação irá rodar
EXPOSE 3000

# Define o comando para iniciar a aplicação
CMD ["npm", "run", "start:prod"]