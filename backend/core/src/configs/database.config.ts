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
	autoLoadEntities: true,
	namingStrategy: new CustomNamingStrategy(),
	keepConnectionAlive: true,
	charset: 'utf8mb4_0900_ai_ci'
}

export const DATABASE = {
	...DATABASE_SHARED,
	database: process.env.MYSQL_DB_NAME,
	entities: [
		path.resolve(process.cwd(), 'dist', '**', '*.entity.{ts,js}'),
		path.resolve(process.cwd(), 'node_modules', '@juicyllama', '**', '*.entity.{ts,js}'),
	],
	//synchronize: true, //becuase TypeORM migrations are pants !!
	synchronize: false, //temp disable to get hive up and running
	debug: Env.IsNotProd(),
}

export const TEST_DATABASE = {
	...DATABASE_SHARED,
	database: process.env.MYSQL_DB_TEST_NAME,
	entities: [path.resolve(process.cwd(), '**', '*.entity.{ts,js}')],
	synchronize: true,
}

export const databaseConfig = registerAs('database', () => {
	return Env.IsTest() ? <TypeOrmModuleOptions>TEST_DATABASE : <TypeOrmModuleOptions>DATABASE
})
