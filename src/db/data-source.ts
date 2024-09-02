import 'dotenv/config'
import 'reflect-metadata'
import { DataSource } from 'typeorm'

const port = parseInt(process.env.DB_PORT) || 1521


export const AppDataSource = new DataSource({
	type: 'oracle',
	host: process.env.DB_HOST,
	port: port,
	username: process.env.DB_USER,
	password: process.env.DB_PASS,
	database: process.env.DB_NAME,
	entities: [__dirname + '/entities/**'],
	migrations: [__dirname + '/migrations/*.ts'],
	synchronize: false,
})

