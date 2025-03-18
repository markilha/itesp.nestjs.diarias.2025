import * as winston from 'winston';

// Configuração do logger com data e hora
export const logger = winston.createLogger({
  level: 'error',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.json(), // Formato JSON
    winston.format.printf(({ timestamp, level, message, ...metadata }) => {
      return `${timestamp} [${level.toUpperCase()}]: ${message} ${JSON.stringify(metadata)}`;
    }),
  ),
  transports: [new winston.transports.File({ filename: 'error.log', level: 'error' })],
});
