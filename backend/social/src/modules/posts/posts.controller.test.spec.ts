import { METHOD, Scaffold, ScaffoldDto, Tag, TestEndpoint } from '@juicyllama/core'
import { POSTS_ENDPOINT, POSTS_PRIMARY_KEY, POSTS_E as E, POSTS_T as T } from './posts.constants'
import { PostsModule } from './posts.module'
import { PostsService } from './posts.service'
import { CreatePostDto } from './posts.dtos'

describe('Social > Posts', () => {
	const scaffolding = new Scaffold<T>()

	let scaffold: ScaffoldDto<T>
	let posts: T[]
	let post: T
	let child_post: T

	let message = 'This is a test post 🙌'
	const message_child = 'This is a test child post 👶'

	beforeAll(async () => {
		scaffold = await scaffolding.up(PostsModule, PostsService)
	})

	describe('Create Post', () => {
		it('Create post', async () => {
			post = <T>await TestEndpoint<T>({
				type: METHOD.POST,
				data: {
					message,
				},
				scaffold: scaffold,
				url: POSTS_ENDPOINT + '/TEST',
				PRIMARY_KEY: POSTS_PRIMARY_KEY,
			})
			expect(post).toBeDefined()
			expect(post.post_id).toBeDefined()
			expect(post.message).toBe(message)
		})

		it('Create child post', async () => {
			child_post = <T>await TestEndpoint<T>({
				type: METHOD.POST,
				data: {
					message: message_child,
					parent_post_id: post.post_id,
				},
				scaffold: scaffold,
				url: POSTS_ENDPOINT + '/TEST',
				PRIMARY_KEY: POSTS_PRIMARY_KEY,
			})
			expect(child_post).toBeDefined()
			expect(child_post.post_id).toBeDefined()
			expect(child_post.message).toBe(message_child)
		})

		it('Child post has parent linked', async () => {
			child_post = <T>await TestEndpoint<T>({
				type: METHOD.GET,
				scaffold: scaffold,
				url: POSTS_ENDPOINT + '/TEST/' + child_post.post_id,
				PRIMARY_KEY: POSTS_PRIMARY_KEY,
			})
			expect(child_post).toBeDefined()
			expect(child_post.post_id).toBeDefined()
			expect(child_post.message).toBe(message_child)
			expect(child_post.parent_post_id).toBeDefined()
			//expect(child_post.parent_post?.message).toBe(message)
		})

		it('Parent post has parent linked', async () => {
			post = <T>await TestEndpoint<T>({
				type: METHOD.GET,
				scaffold: scaffold,
				url: POSTS_ENDPOINT + '/TEST/' + post.post_id,
				PRIMARY_KEY: POSTS_PRIMARY_KEY,
			})
			expect(post).toBeDefined()
			expect(post.post_id).toBeDefined()
			expect(post.message).toBe(message)
			expect(post.parent_post_id).toBeNull()
			expect(post.child_posts).toBeDefined()
			post.child_posts = post.child_posts || []
			expect(post.child_posts[0]).toBeDefined()
			expect(post.child_posts[0].post_id).toBe(child_post.post_id)
			expect(post.child_posts[0].message).toBe(message_child)
		})
	})

	describe('Post Tags', () => {
		it('Create post with tags', async () => {
			post = <T>await TestEndpoint<T>({
				type: METHOD.POST,
				data: <any>(<CreatePostDto>{
					message,
					tags: ['tag1', 'tag2'],
				}),
				scaffold: scaffold,
				url: POSTS_ENDPOINT + '/TEST',
				PRIMARY_KEY: POSTS_PRIMARY_KEY,
			})
			expect(post).toBeDefined()
			expect(post.post_id).toBeDefined()
			expect(post.message).toBe(message)
			expect(post.tags).toBeDefined()
			expect(post.tags).toHaveLength(2)
			post.tags = post.tags || []
			expect(post.tags[0].name).toBe('tag1')
			expect(post.tags[1].name).toBe('tag2')
		})

		it('Add tag to post', async () => {
			post = <T>await TestEndpoint<T>({
				type: METHOD.POST,
				scaffold: scaffold,
				url: POSTS_ENDPOINT + '/TEST/' + post.post_id + '/tag/tag3',
				skipResultCheck: true,
			})
			expect(post).toBeDefined()
			expect(post.post_id).toBeDefined()
			expect(post.tags).toBeDefined()
			expect(post.tags).toHaveLength(3)
			post.tags = <Tag[]>post.tags
			expect(post.tags[2].name).toBe('tag3')
		})

		it('Delete tag to post', async () => {
			post = <T>await TestEndpoint<T>({
				type: METHOD.DELETE,
				scaffold: scaffold,
				url: POSTS_ENDPOINT + '/TEST/' + post.post_id + '/tag/tag1',
				skipResultCheck: true,
			})
			expect(post).toBeDefined()
			expect(post.post_id).toBeDefined()
			expect(post.tags).toBeDefined()
			expect(post.tags).toHaveLength(2)
			post.tags = post.tags || []
			expect(post.tags[0].name).toBe('tag2')
			expect(post.tags[1].name).toBe('tag3')
		})
	})

	describe('Edit Post', () => {
		it('Post message', async () => {
			post = <T>await TestEndpoint<T>({
				type: METHOD.GET,
				scaffold: scaffold,
				url: POSTS_ENDPOINT + '/TEST/' + post.post_id,
				PRIMARY_KEY: POSTS_PRIMARY_KEY,
			})
			expect(post).toBeDefined()
			expect(post.post_id).toBeDefined()
			expect(post.message).toBe(message)

			message = 'This is an edited post 🙌'

			post = <T>await TestEndpoint<T>({
				type: METHOD.PATCH,
				data: {
					message,
				},
				scaffold: scaffold,
				url: POSTS_ENDPOINT + '/TEST/' + post.post_id,
				PRIMARY_KEY: POSTS_PRIMARY_KEY,
			})
			expect(post).toBeDefined()
			expect(post.post_id).toBeDefined()
			expect(post.message).toBe(message)
		})
	})

	describe('Delete Post', () => {
		it('Delete child post', async () => {
			await TestEndpoint<T>({
				type: METHOD.DELETE,
				scaffold: scaffold,
				url: POSTS_ENDPOINT + '/TEST/' + child_post.post_id,
				skipResultCheck: true,
			})

			child_post = <T>await TestEndpoint<T>({
				type: METHOD.GET,
				scaffold: scaffold,
				url: POSTS_ENDPOINT + '/TEST/' + child_post.post_id,
				skipResultCheck: true,
			})
			expect(child_post).toBeDefined()
			expect(child_post.post_id).toBeUndefined()

			post = <T>await TestEndpoint<T>({
				type: METHOD.GET,
				scaffold: scaffold,
				url: POSTS_ENDPOINT + '/TEST/' + post.post_id,
				skipResultCheck: true,
			})
			expect(post).toBeDefined()
			expect(post.post_id).toBeDefined()
			expect(post.child_posts?.length).toBe(0)
		})
	})

	describe('Get Feed', () => {
		it('Get post feed', async () => {
			posts = <T[]>await TestEndpoint<T[]>({
				type: METHOD.GET,
				scaffold: <any>scaffold,
				url: POSTS_ENDPOINT + '/TEST/feed',
				skipResultCheck: true,
			})
			expect(posts).toBeDefined()
			expect(posts[0].post_id).toBeDefined()
		})
	})

	describe('Post Likes', () => {
		it('Like a post', async () => {
			post = <T>await TestEndpoint<T>({
				type: METHOD.PUT,
				scaffold: scaffold,
				url: POSTS_ENDPOINT + '/TEST/' + post.post_id + '/like',
				skipResultCheck: true,
			})
			expect(post).toBeDefined()
			expect(post.post_id).toBeDefined()
			expect(post.likes).toBeDefined()
			expect(post.likes?.length).toBe(1)
			post.likes = post.likes || []
			expect(post.likes[0]).toBeDefined()
			expect(post.likes[0].user_id).toBe(scaffold.values.owner.user_id)
		})

		it('Unlike a post', async () => {
			post = <T>await TestEndpoint<T>({
				type: METHOD.PUT,
				scaffold: scaffold,
				url: POSTS_ENDPOINT + '/TEST/' + post.post_id + '/like',
				skipResultCheck: true,
			})
			expect(post).toBeDefined()
			expect(post.post_id).toBeDefined()
			expect(post.likes).toBeDefined()
			expect(post.likes?.length).toBe(0)
		})
	})

	describe('Report Post', () => {
		it('Report a post', async () => {
			const message = 'This is a test report'
			post = <T>await TestEndpoint<T>({
				type: METHOD.PUT,
				scaffold: scaffold,
				url: POSTS_ENDPOINT + '/TEST/' + post.post_id + '/report',
				data: {
					message,
				},
				skipResultCheck: true,
			})
			expect(post).toBeDefined()
			expect(post.post_id).toBeDefined()
			expect(post.complaints).toBeDefined()
			expect(post.complaints?.length).toBe(1)
			post.complaints = post.complaints || []
			expect(post.complaints[0]).toBeDefined()
			expect(post.complaints[0].user_id).toBe(scaffold.values.owner.user_id)
			expect(post.complaints[0].message).toBe(message)
		})
	})

	afterAll(async () => {
		await scaffolding.down(E)
	})
})
