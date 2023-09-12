import { getRepositoryToken } from '@nestjs/typeorm'
import { TestingModule } from '@nestjs/testing'
import { Account } from '../modules/accounts/account.entity'

export async function testCleanup(moduleRef: TestingModule, repo?: any) {
	const repository = moduleRef.get(getRepositoryToken(repo ?? Account))
	await repository.query(`SET FOREIGN_KEY_CHECKS = 0;`)
	await repository.query(`SET GROUP_CONCAT_MAX_LEN=32768;`)
	await repository.query(`SET @tables = NULL;`)
	await repository.query(
		`SELECT GROUP_CONCAT('\`', table_name, '\`') INTO @tables FROM information_schema.tables WHERE table_schema = (SELECT DATABASE());`,
	)
	await repository.query(`SELECT IFNULL(@tables,'dummy') INTO @tables;`)
	await repository.query(`SET @tables = CONCAT('DROP TABLE IF EXISTS ', @tables);`)
	await repository.query(`PREPARE stmt FROM @tables;`)
	await repository.query(`EXECUTE stmt;`)
	await repository.query(`DEALLOCATE PREPARE stmt;`)
	await repository.query(`SET FOREIGN_KEY_CHECKS = 1;`)
	await moduleRef.close()
}
