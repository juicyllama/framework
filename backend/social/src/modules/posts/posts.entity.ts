import {
	AfterLoad,
	Column,
	Entity,
	JoinColumn,
	JoinTable,
	ManyToMany,
	ManyToOne,
	OneToMany,
	PrimaryGeneratedColumn,
} from 'typeorm'
import { PostComplaints } from './complaints/complaints.entity'
import { PostLikes } from './likes/likes.entity'
import { ClassSerializerInterceptor, UseInterceptors } from '@nestjs/common'
import { BaseEntity, Tag, User } from '@juicyllama/core'
import { IsString, IsNumber, IsArray } from 'class-validator'

@UseInterceptors(ClassSerializerInterceptor)
@Entity('social_posts')
export class Post extends BaseEntity {
	@PrimaryGeneratedColumn()
	post_id!: number

	@Column()
	@IsString()
	wall_identifier!: string

	@ManyToOne(() => User, (user: User) => user.user_id, {
		onDelete: 'CASCADE',
	})
	@JoinColumn({ name: 'user_id' })
	user?: User

	@Column()
	@IsNumber()
	user_id!: number

	@Column({
		type: 'blob',
	})
	message!: string

	@ManyToOne(() => Post, (post: Post) => post.child_posts, {
		onDelete: 'SET NULL',
	})
	@JoinColumn({ name: 'parent_post_id' })
	parent_post?: Post

	@Column({ nullable: true, default: null })
	@IsNumber()
	parent_post_id?: number

	@OneToMany(() => Post, (post: Post) => post.parent_post)
	child_posts?: Post[]

	@OneToMany(() => PostComplaints, (complaints: PostComplaints) => complaints.post)
	complaints?: PostComplaints[]

	@OneToMany(() => PostLikes, (likes: PostLikes) => likes.post)
	likes?: PostLikes[]

	@ManyToMany(() => Tag, tag => tag, { cascade: true })
	@JoinTable({
		name: 'social_posts_tags',
		joinColumn: { name: 'post_id', referencedColumnName: 'post_id' },
		inverseJoinColumn: { name: 'tag_id', referencedColumnName: 'tag_id' },
	})
	@IsArray()
	tags?: Tag[]

	@Column({
		type: 'json',
		nullable: true,
		default: null,
	})
	json?: any

	@AfterLoad()
	convertToString() {
		const b = Buffer.from(this.message)
		this.message = b.toString()
	}
}
