import {
	ExportTask,
	RDSClient,
	StartExportTaskCommand,
	StartExportTaskCommandInput,
	DescribeExportTasksCommand,
	DescribeExportTasksCommandInput,
	DescribeExportTasksCommandOutput,
} from '@aws-sdk/client-rds'
import { Env, Logger } from '@juicyllama/utils'
import { Injectable } from '@nestjs/common'
import { mockRDSExportTask } from './aws.rds.mock'
import { InjectRds } from './aws.rds.constants'

@Injectable()
export class AwsRdsService {
	constructor(
		private readonly logger: Logger,
		@InjectRds() private readonly client: RDSClient,
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

		const command = new StartExportTaskCommand(params)
		return <ExportTask>await this.client.send(command)
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

		const command = new DescribeExportTasksCommand(input)
		return <DescribeExportTasksCommandOutput>await this.client.send(command)
	}
}
