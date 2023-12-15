
export type AwsS3Bucket = AwsS3BucketType.PUBLIC | AwsS3BucketType.PRIVATE | string

export enum AwsS3BucketType {
	PUBLIC = 'PUBLIC',
	PRIVATE = 'PRIVATE',

}

export enum AwsS3Format {
	BLOB = 'BLOB',
	JSON = 'JSON',
	CSV = 'CSV',
}
