import {
	Controller,
	forwardRef,
	Inject,
	Param,
	Req,
	Get,
	Post,
	Patch,
	Put,
	Delete,
	Body,
	BadRequestException,
} from '@nestjs/common'
import { ApiTags, ApiOperation } from '@nestjs/swagger'
import {
	Query as TQuery,
	AccountId,
	AuthService,
	UserAuth,
	BaseController,
	AuthenticatedRequest,
} from '@juicyllama/core'
import { postsConstants as constants, POSTS_T as T } from './posts.constants'
import { PostsService } from './posts.service'
import { CreatePostDto, PostLikeDto, ReportPostDto, UpdatePostDto } from './posts.dtos'

@ApiTags('Posts')
@UserAuth()
@Controller('social/posts/:wall_identifier')
export class PostsController extends BaseController<T> {
	constructor(
		@Inject(forwardRef(() => AuthService)) readonly authService: AuthService,
		@Inject(forwardRef(() => PostsService)) readonly service: PostsService,
		@Inject(forwardRef(() => TQuery)) readonly tQuery: TQuery<T>,
	) {
		super(service, tQuery, constants, {
			services: {
				authService,
			},
		})
	}

	@ApiOperation({ summary: 'Create Post' })
	@Post()
	async createPost(
		@Req() req: AuthenticatedRequest,
		@AccountId() account_id: number,
		@Param('wall_identifier') wall_identifier: string,
		@Body() body: CreatePostDto,
	): Promise<T> {
		await this.authService.check(req.user.user_id, account_id)
		return await this.service.createPost(wall_identifier, req.user.user_id, body)
	}

	@ApiOperation({ summary: 'Get Feed' })
	@Get('feed')
	async getFeed(
		@Req() req: AuthenticatedRequest,
		@AccountId() account_id: number,
		@Param('wall_identifier') wall_identifier: string,
	): Promise<T[]> {
		await this.authService.check(req.user.user_id, account_id)

		return await this.service.getFeedPosts(wall_identifier, req.user.user_id)
	}

	@ApiOperation({ summary: 'Get Post' })
	@Get(':post_id')
	async getPost(
		@Req() req: AuthenticatedRequest,
		@AccountId() account_id: number,
		@Param('wall_identifier') wall_identifier: string,
		@Param('post_id') post_id: number,
	): Promise<T> {
		await this.authService.check(req.user.user_id, account_id)

		return await this.service.findOne({
			where: [
				{
					wall_identifier,
					post_id: post_id,
				},
			],
		})
	}

	@ApiOperation({ summary: 'Edit Post' })
	@Patch(':post_id')
	async editPost(
		@Req() req: AuthenticatedRequest,
		@AccountId() account_id: number,
		@Param('wall_identifier') wall_identifier: string,
		@Param('post_id') post_id: number,
		@Body() body: UpdatePostDto,
	): Promise<T> {
		await this.authService.check(req.user.user_id, account_id)

		const post = await this.service.findOne({
			where: {
				wall_identifier,
				post_id,
				user_id: req.user.user_id,
			},
		})

		if (!post) {
			throw new BadRequestException('Post not found')
		}

		return await this.service.update({
			post_id,
			...body,
		})
	}

	@ApiOperation({ summary: 'Add Post Tag' })
	@Post(':post_id/tag/:tag')
	async addPostTag(
		@Req() req: AuthenticatedRequest,
		@AccountId() account_id: number,
		@Param('wall_identifier') wall_identifier: string,
		@Param('post_id') post_id: number,
		@Param('tag') tag: string,
	): Promise<T> {
		await this.authService.check(req.user.user_id, account_id)

		const post = await this.service.findOne({
			where: {
				wall_identifier,
				post_id,
				user_id: req.user.user_id,
			},
		})

		if (!post) {
			throw new BadRequestException('Post not found')
		}

		return await this.service.addTag(post_id, tag)
	}

	@ApiOperation({ summary: 'Remove Post Tag' })
	@Delete(':post_id/tag/:tag')
	async removePostTag(
		@Req() req: AuthenticatedRequest,
		@AccountId() account_id: number,
		@Param('wall_identifier') wall_identifier: string,
		@Param('post_id') post_id: number,
		@Param('tag') tag: string,
	): Promise<T> {
		await this.authService.check(req.user.user_id, account_id)

		const post = await this.service.findOne({
			where: {
				wall_identifier,
				post_id,
				user_id: req.user.user_id,
			},
		})

		if (!post) {
			throw new BadRequestException('Post not found')
		}

		if (!post.tags) {
			return post
		}

		return await this.service.removeTag(post_id, tag)
	}

	@ApiOperation({ summary: 'Delete Post' })
	@Delete(':post_id')
	async deletePost(
		@Req() req: AuthenticatedRequest,
		@AccountId() account_id: number,
		@Param('wall_identifier') wall_identifier: string,
		@Param('post_id') post_id: number,
	): Promise<void> {
		await this.authService.check(req.user.user_id, account_id)

		const post = await this.service.findOne({
			where: {
				wall_identifier,
				post_id,
				user_id: req.user.user_id,
			},
		})

		if (!post) {
			throw new BadRequestException('Post not found')
		}

		return await this.service.purge(post)
	}

	@ApiOperation({ summary: 'Like/Unlike Post' })
	@Put(':post_id/like')
	async togglePostLike(
		@Req() req: AuthenticatedRequest,
		@AccountId() account_id: number,
		@Param('wall_identifier') wall_identifier: string,
		@Param('post_id') post_id: number,
		@Body() body: PostLikeDto,
	): Promise<T> {
		await this.authService.check(req.user.user_id, account_id)

		const post = await this.service.findOne({
			where: {
				wall_identifier,
				post_id,
			},
		})

		if (!post) {
			throw new BadRequestException('Post not found')
		}

		return await this.service.toggleLike(post.post_id, req.user.user_id, body.json)
	}

	@ApiOperation({ summary: 'Report Post' })
	@Put(':post_id/report')
	async reportPost(
		@Req() req: AuthenticatedRequest,
		@AccountId() account_id: number,
		@Param('wall_identifier') wall_identifier: string,
		@Param('post_id') post_id: number,
		@Body() body: ReportPostDto,
	): Promise<T> {
		await this.authService.check(req.user.user_id, account_id)

		const post = await this.service.findOne({
			where: {
				wall_identifier,
				post_id,
			},
		})

		if (!post) {
			throw new BadRequestException('Post not found')
		}

		return await this.service.reportPost(post.post_id, req.user.user_id, body.message, body.json)
	}
}
