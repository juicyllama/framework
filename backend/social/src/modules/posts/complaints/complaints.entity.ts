import { AfterLoad, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm'
import { Post } from '../posts.entity'
import { ClassSerializerInterceptor, UseInterceptors } from '@nestjs/common'
import { BaseEntity, User } from '@juicyllama/core'
import { IsNumber } from 'class-validator'

@UseInterceptors(ClassSerializerInterceptor)
@Entity('social_posts_complaints')
@Unique(['post_id', 'user_id'])
export class PostComplaints extends BaseEntity {
	@PrimaryGeneratedColumn()
	complaint_id!: number

	@ManyToOne(() => Post, (post: Post) => post.post_id, {
		onDelete: 'CASCADE',
	})
	@JoinColumn({ name: 'post_id' })
	post?: Post

	@Column()
	@IsNumber()
	post_id!: number

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

	@Column({
		type: 'json',
		nullable: true,
		default: null,
	})
	json: any

	@AfterLoad()
	convertToString() {
		const b = Buffer.from(this.message)
		this.message = b.toString()
	}
}
