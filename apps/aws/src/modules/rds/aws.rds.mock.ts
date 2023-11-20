import { ExportTask } from '@aws-sdk/client-rds'

export const mockRDSExportTask: ExportTask =
{
    "ExportTaskIdentifier": "my-s3-export",
    "IamRoleArn": "arn:aws:iam::123456789012:role/service-role/ExportRole",
    "KmsKeyId": "arn:aws:kms:us-west-2:123456789012:key/abcd0000-7fca-4128-82f2-aabbccddeeff",
    "PercentProgress": 0,
    "S3Bucket": "mybucket",
    "SnapshotTime": new Date("2020-03-27T20:48:42.023Z"),
    "SourceArn": "arn:aws:rds:us-west-2:123456789012:snapshot:db5-snapshot-test",
    "Status": "STARTING",
    "TotalExtractedDataInGB": 0
  }