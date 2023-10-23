export interface Widget {}
export interface Dashboard {
	url?: string
	title?: string
	published?: boolean
	widgets: Widget[]
}
