
export type AwsS3Bucket = AwsS3BucketType.PUBLIC | AwsS3BucketType.PRIVATE | string

export enum AwsS3BucketType {
	PUBLIC = 'PUBLIC',
	PRIVATE = 'PRIVATE',

}

export type AwsS3Format = AwsS3FormatType.BLOB | AwsS3FormatType.JSON | AwsS3FormatType.CSV | string

export enum AwsS3FormatType {
	BLOB = 'BLOB',
	JSON = 'JSON',
	CSV = 'CSV',
	PARQUET = 'PARQUET',
}
