import { BeaconService, Query, BaseService } from '@juicyllama/core'
import { Inject, Injectable, forwardRef } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, In } from 'typeorm'
import { Connection } from './connection.entity'
import { ConnectionType } from './connection.enums'

const E = Connection
type T = Connection

@Injectable()
export class ConnectionService extends BaseService<T> {
	constructor(
		@InjectRepository(E) readonly repository: Repository<T>,
		@Inject(Query) readonly query: Query<T>,
		@Inject(forwardRef(() => BeaconService)) readonly beaconService: BeaconService,
	) {
		super(query, repository, {
			beacon: beaconService,
		})
	}

	/*
	 * Get all connections for a user (primary side) includes Follows and Friends
	 */

	async getPrimarySideConnections(user_id: number): Promise<Connection[]> {
		return await super.findAll({
			where: [
				{
					user_id,
					type: In([ConnectionType.FOLLOW, ConnectionType.FRIENDS]),
				},
			],
		})
	}

	async createConnection(
		connection_identifier: string,
		primary_user_id: number,
		secondary_user_id: number,
	): Promise<Connection> {
		const connections = await super.findAll({
			where: [
				{
					connection_identifier,
					user_id: primary_user_id,
					connection_user_id: secondary_user_id,
				},
				{
					connection_identifier,
					user_id: secondary_user_id,
					connection_user_id: primary_user_id,
				},
			],
		})

		switch (connections.length) {
			case 1:
				if (connections[0].user_id === primary_user_id) {
					return connections[0]
				} else {
					await super.update({
						connection_id: connections[0].connection_id,
						type: ConnectionType.FRIENDS,
					})

					return await super.create({
						connection_identifier,
						user_id: primary_user_id,
						connection_user_id: secondary_user_id,
						type: ConnectionType.FRIENDS,
					})
				}

			case 2:
				return <Connection>connections.find(connection => connection.user_id === primary_user_id)

			default:
				return await super.create({
					connection_identifier,
					user_id: primary_user_id,
					connection_user_id: secondary_user_id,
					type: ConnectionType.FOLLOW,
				})
		}
	}

	async deleteConnection(
		connection_identifier: string,
		primary_user_id: number,
		secondary_user_id: number,
	): Promise<void> {
		const connection = await super.findOne({
			where: [
				{
					connection_identifier,
					user_id: primary_user_id,
					connection_user_id: secondary_user_id,
				},
			],
		})

		if (!connection) {
			return
		}

		await super.purge(connection)

		//check if the secondary side connection exists
		const secondary = await super.findOne({
			where: [
				{
					connection_identifier,
					user_id: secondary_user_id,
					connection_user_id: primary_user_id,
				},
			],
		})

		if (secondary) {
			await super.update({
				connection_id: secondary.connection_id,
				type: ConnectionType.FOLLOW,
			})
		}
	}
}
