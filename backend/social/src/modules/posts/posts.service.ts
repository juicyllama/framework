import { Inject, Injectable, forwardRef } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Post } from './posts.entity'
import { Repository, In } from 'typeorm'
import { BeaconService, Query, BaseService, Tag, TagsService } from '@juicyllama/core'
import { ConnectionService } from '../connection/connection.service'
import { PostsLikesService } from './likes/likes.service'
import { PostsComplaintsService } from './complaints/complaints.service'
import { CreatePostDto } from './posts.dtos'

const E = Post
type T = Post

@Injectable()
export class PostsService extends BaseService<T> {
	constructor(
		@InjectRepository(E) readonly repository: Repository<T>,
		@Inject(Query) readonly query: Query<T>,
		@Inject(forwardRef(() => BeaconService)) readonly beaconService: BeaconService,
		@Inject(forwardRef(() => ConnectionService)) readonly connectionService: ConnectionService,
		@Inject(forwardRef(() => PostsLikesService)) readonly postsLikesService: PostsLikesService,
		@Inject(forwardRef(() => PostsComplaintsService)) readonly postsComplaintsService: PostsComplaintsService,
		@Inject(forwardRef(() => TagsService)) readonly tagsService: TagsService,
	) {
		super(query, repository, {
			beacon: beaconService,
		})
	}

	async createPost(wall_identifier: string, user_id: number, data: CreatePostDto): Promise<T> {
		const tags: Tag[] = []

		if (data.tags) {
			for (const tag of data.tags) {
				const tagEntity = await this.tagsService.findOne({
					where: [
						{
							name: tag,
						},
					],
				})

				if (tagEntity) {
					tags.push(tagEntity)
				} else {
					tags.push(
						await this.tagsService.create({
							name: tag,
						}),
					)
				}
			}
		}

		const post = await super.create({
			wall_identifier,
			user_id,
			message: data.message,
			parent_post_id: data.parent_post_id,
		})

		for (const tag of tags) {
			await super.raw(`INSERT INTO social_posts_tags (post_id, tag_id) VALUES (${post.post_id}, ${tag.tag_id})`)
		}

		return await super.findById(post.post_id)
	}

	async getFeedPosts(wall_identifier: string, user_id: number): Promise<Post[]> {
		const connections = await this.connectionService.getPrimarySideConnections(user_id)
		const connectionIds = connections.map(connection => connection.connection_user_id)

		return await super.findAll({
			where: [
				{
					wall_identifier,
					user_id: In([...connectionIds, user_id]),
				},
			],
		})
	}

	async toggleLike(post_id: number, user_id: number, like_json: any): Promise<Post> {
		const post = await super.findOne({
			where: {
				post_id,
			},
		})

		const like = post.likes?.find(like => like.user_id === user_id)

		if (like) {
			await this.postsLikesService.purge(like)
		} else {
			await this.postsLikesService.create({
				post_id,
				user_id,
				json: like_json,
			})
		}

		return await super.findById(post.post_id)
	}

	async reportPost(post_id: number, user_id: number, message: string, report_json?: any): Promise<Post> {
		const complaint = await this.postsComplaintsService.findOne({
			where: {
				post_id,
				user_id,
			},
		})

		if (complaint) {
			await this.postsComplaintsService.update({
				complaint_id: complaint.complaint_id,
				message,
				json: report_json,
			})
		} else {
			await this.postsComplaintsService.create({
				post_id,
				user_id,
				message,
				json: report_json,
			})
		}

		return await super.findById(post_id)
	}

	async addTag(post_id: number, tag: string): Promise<T> {
		let tagEntity = await this.tagsService.findOne({
			where: [
				{
					name: tag,
				},
			],
		})

		if (!tagEntity) {
			tagEntity = await this.tagsService.create({
				name: tag,
			})
		}

		await super.raw(`INSERT INTO social_posts_tags (post_id, tag_id) VALUES (${post_id}, ${tagEntity.tag_id})`)
		return await super.findById(post_id)
	}

	async removeTag(post_id: number, tag: string): Promise<T> {

		const tagEntity = await this.tagsService.findOne({
			where: [
				{
					name: tag,
				},
			],
		})

		if (tagEntity) {
			await super.raw(`DELETE FROM social_posts_tags WHERE tag_id = ${tagEntity.tag_id} AND post_id = ${post_id}`)
		}

		return await super.findById(post_id)
	}
}
