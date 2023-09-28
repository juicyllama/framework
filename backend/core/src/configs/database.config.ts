import { TypeOrmModuleOptions } from '@nestjs/typeorm'
import { registerAs } from '@nestjs/config'
import { CustomNamingStrategy } from '../utils/typeorm/naming.strategy'
import { Env } from '@juicyllama/utils'
import * as path from 'path'
import { config } from 'dotenv'
config()

const DATABASE_SHARED = {
	type: 'mysql',
	host: process.env.MYSQL_HOSTNAME,
	port: +process.env.MYSQL_PORT,
	username: process.env.MYSQL_USERNAME,
	password: process.env.MYSQL_PASSWORD,
	namingStrategy: new CustomNamingStrategy(),
	keepConnectionAlive: true,
	charset: 'utf8mb4_0900_ai_ci',
	autoLoadEntities: true,
	entities: [
		path.resolve(process.cwd(), 'dist', '**', '*.entity.js'),
		path.resolve(process.cwd(), 'node_modules', '@juicyllama', '**', '*.entity.js'),
	],
	autoLoadMigrations: false, //should be false in live, otherwise long running migration will cause issues with microservices booting up
	migrations: [path.resolve(process.cwd(), 'dist', 'db', 'migrations', '*.js')],
}

export const DATABASE = {
	...DATABASE_SHARED,
	database: process.env.MYSQL_DB_NAME,
	synchronize: false,
	debug: Env.IsNotProd(),
}

export const TEST_DATABASE = {
	...DATABASE_SHARED,
	database: process.env.MYSQL_DB_TEST_NAME,
	synchronize: true,
}

export const databaseConfig = registerAs('database', () => {
	return Env.IsTest() ? <TypeOrmModuleOptions>TEST_DATABASE : <TypeOrmModuleOptions>DATABASE
})
