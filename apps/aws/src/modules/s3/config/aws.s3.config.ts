import { AwsS3BucketType } from '../aws.s3.enums'
import { S3ClientConfig } from '@aws-sdk/client-s3/dist-types/S3Client'

export function awsS3Config() {
	return {
		apiVersion: '2006-03-01',
		s3buckets: {
			[AwsS3BucketType.PUBLIC]: process.env.AWS_S3_JL_PUBLIC_BUCKET,
			[AwsS3BucketType.PRIVATE]: process.env.AWS_S3_JL_PRIVATE_BUCKET,
		},
		region: process.env.AWS_S3_JL_REGION,
		client: <S3ClientConfig>{
			region: process.env.AWS_S3_JL_REGION,
			credentials: {
				accessKeyId: process.env.AWS_JL_ACCESS_KEY_ID,
				secretAccessKey: process.env.AWS_JL_SECRET_KEY_ID,
			},
		},
	}
}
