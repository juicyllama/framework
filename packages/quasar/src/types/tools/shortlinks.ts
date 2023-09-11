export interface Shortlink {
	shortlink_id: number
	urlCode: string
	longUrl: string
	shortUrl: string
	resource_type?: string
	resource_id?: number
	created_at: string
	updated_at: string
}
