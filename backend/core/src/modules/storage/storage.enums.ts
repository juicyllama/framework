export type StorageFileType = StorageType.PUBLIC | StorageType.PRIVATE | string

export enum StorageType {
	PUBLIC = 'PUBLIC',
	PRIVATE = 'PRIVATE',
}

export enum StorageFileFormat {
	BLOB = 'BLOB',
	JSON = 'JSON',
	CSV = 'CSV',
	Express_Multer_File = 'Express_Multer_File',
}
