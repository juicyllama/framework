export interface Wehbook {
	address: string
	api_version: string
	fields: string[]
	format: string
	metafield_namespaces?: string[]
	private_metafield_namespaces?: string[]
	topic: string
	created_at: Date
	updated_at: Date
}
