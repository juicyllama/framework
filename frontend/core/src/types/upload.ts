export enum SourceType {
	FILE,
	URL,
}

export type SourceEntry = {
	source: string
	type: SourceType
	file?: File
}
