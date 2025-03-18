import 'dotenv/config';
import 'reflect-metadata';
import { DataSource } from 'typeorm';

const port = parseInt(process.env.DB_USER_PORT) || 3306;

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: port,
  username: process.env.DB_USER_USER,
  password: process.env.DB_PASS_USER,
  database: process.env.DB_NAME_USER,
  entities: [__dirname + '/entities/**'],
  migrations: [__dirname + '/migrations/*.ts'],
  synchronize: false,
});
