import { Repository } from 'typeorm'

export function RepositoriesToOpenAISQLSchema(repos: Repository<any>[]) {
	let schema = `### Mysql sql tables, with their properties: \n#`

	for (const r in repos) {
		schema += `\n# ${repos[r].metadata.tableName}(`

		for (const column of repos[r].metadata.columns) {
			schema += `${column.propertyName}, `
		}
		schema = schema.replace(/,\s*$/, '')
		schema += ')'
	}

	schema += '\n# \n### '

	return schema
}
