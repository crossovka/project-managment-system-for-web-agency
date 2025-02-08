/* eslint-disable indent */
import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	OneToMany,
	CreateDateColumn,
	UpdateDateColumn
} from 'typeorm'
import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator'
import { Post } from 'src/posts/entities/posts.entity'

@Entity('categories')
export class Category {
	@PrimaryGeneratedColumn()
	category_id: number

	/** Name of the category */
	@Column({ length: 100 })
	@IsNotEmpty()
	@IsString()
	@Length(1, 100)
	name: string

	/** Description of the category */
	@Column({ type: 'text', nullable: true })
	@IsOptional()
	@IsString()
	description?: string

	/** Posts under this category */
	@OneToMany(() => Post, (post) => post.category, { cascade: true })
	posts: Post[]

	/** Timestamps */
	@CreateDateColumn()
	createdAt: Date

	@UpdateDateColumn()
	updatedAt: Date
}
