import { DataSource, DataSourceOptions } from 'typeorm'
import { DATABASE, TEST_DATABASE } from './database.config.js'
import { Env } from '@juicyllama/utils'

export default new DataSource(Env.IsTest() ? <DataSourceOptions>TEST_DATABASE : <DataSourceOptions>DATABASE)
