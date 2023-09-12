import { registerAs } from '@nestjs/config'

export default registerAs(
	'awsS3',
	() =>
		<any>{
			AWS_S3_JL_PUBLIC_BUCKET: process.env.AWS_S3_JL_PUBLIC_BUCKET,
			AWS_S3_JL_PRIVATE_BUCKET: process.env.AWS_S3_JL_PRIVATE_BUCKET,
			AWS_S3_JL_REGION: process.env.AWS_S3_JL_REGION,
		},
)
