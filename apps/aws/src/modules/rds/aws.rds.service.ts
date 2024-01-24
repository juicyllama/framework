import { forwardRef, Inject, Injectable } from '@nestjs/common'
import { Env, Logger } from '@juicyllama/utils'
import {
	ExportTask,
	RDSClient,
	RDSClientConfig,
	StartExportTaskCommand,
	StartExportTaskCommandInput,
	DescribeExportTasksCommand,
	DescribeExportTasksCommandInput,
	DescribeExportTasksCommandOutput,
} from '@aws-sdk/client-rds'
import { ConfigService } from '@nestjs/config'
import { mockRDSExportTask } from './aws.rds.mock'

@Injectable()
export class AwsRdsService {
	constructor(
		@Inject(forwardRef(() => ConfigService)) private readonly configService: ConfigService,
		@Inject(forwardRef(() => Logger)) private readonly logger: Logger,
	) {}

	/**
	 * Start Export Task
	 *
	 * @param {StartExportTaskCommandInput} params
	 */

	async startExportTask(params: StartExportTaskCommandInput): Promise<ExportTask> {
		const domain = 'app::aws::rds::AwsRdsService::startExportTask'

		this.logger.debug(`[${domain}] Start Export Task`, params)

		if (Env.IsTest()) {
			this.logger.debug(`[${domain}] Skipping as in test mode`)
			return mockRDSExportTask
		}

		const client = new RDSClient(<RDSClientConfig>{
			region:
				this.configService.get<string>('awsRds.AWS_RDS_JL_REGION') ??
				this.configService.get<string>('aws.AWS_JL_REGION'),
			credentials: {
				accessKeyId: this.configService.get<string>('aws.AWS_JL_ACCESS_KEY_ID'),
				secretAccessKey: this.configService.get<string>('aws.AWS_JL_SECRET_KEY_ID'),
			},
		})

		const command = new StartExportTaskCommand(params)
		return <ExportTask>await client.send(command)
	}

	/**
	 * Describe Export Task
	 *
	 * @param {StartExportTaskCommandInput} params
	 */

	async describeExportTask(input: DescribeExportTasksCommandInput): Promise<DescribeExportTasksCommandOutput> {
		const domain = 'app::aws::rds::AwsRdsService::describeExportTask'

		this.logger.debug(`[${domain}] Describe Export Task`, input)

		if (Env.IsTest()) {
			this.logger.debug(`[${domain}] Skipping as in test mode`)
			return <any>[mockRDSExportTask]
		}

		const client = new RDSClient(<RDSClientConfig>{
			region:
				this.configService.get<string>('awsRds.AWS_RDS_JL_REGION') ??
				this.configService.get<string>('aws.AWS_JL_REGION'),
			credentials: {
				accessKeyId: this.configService.get<string>('aws.AWS_JL_ACCESS_KEY_ID'),
				secretAccessKey: this.configService.get<string>('aws.AWS_JL_SECRET_KEY_ID'),
			},
		})

		const command = new DescribeExportTasksCommand(input)
		return <DescribeExportTasksCommandOutput>await client.send(command)
	}
}
