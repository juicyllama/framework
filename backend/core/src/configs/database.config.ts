import { TypeOrmModuleOptions } from '@nestjs/typeorm'
import { registerAs } from '@nestjs/config'
import { CustomNamingStrategy } from '../utils/typeorm/naming.strategy'
import { Env } from '@juicyllama/utils'
import * as path from 'path'
import { config } from 'dotenv'
config()

export const DATABASE = {
	type: 'mysql',
	host: process.env.MYSQL_HOSTNAME,
	port: +process.env.MYSQL_PORT,
	username: process.env.MYSQL_USERNAME,
	password: process.env.MYSQL_PASSWORD,
	database: process.env.MYSQL_DB_NAME,
	entities: [
		path.resolve(process.cwd(), 'dist', '**', '*.entity.{ts,js}'),
		path.resolve(process.cwd(), 'node_modules', '@juicyllama', '**', '*.entity.{ts,js}'),
	],
	autoLoadEntities: true,
	synchronize: Env.IsNotProd(), //becuase TypeORM migrations are pants !!
	namingStrategy: new CustomNamingStrategy(),
	keepConnectionAlive: true,
	debug: Env.IsNotProd(),
}

export const TEST_DATABASE = {
	type: 'mysql',
	host: process.env.MYSQL_HOSTNAME,
	port: +process.env.MYSQL_PORT,
	username: process.env.MYSQL_USERNAME,
	password: process.env.MYSQL_PASSWORD,
	database: process.env.MYSQL_DB_TEST_NAME,
	entities: [path.resolve(process.cwd(), '**', '*.entity.{ts,js}')],
	autoLoadEntities: true,
	synchronize: true,
	namingStrategy: new CustomNamingStrategy(),
	keepConnectionAlive: true,
}

export const databaseConfig = registerAs('database', () => {
	return Env.IsTest() ? <TypeOrmModuleOptions>TEST_DATABASE : <TypeOrmModuleOptions>DATABASE
})
