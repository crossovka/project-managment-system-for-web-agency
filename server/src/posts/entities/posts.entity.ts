/* eslint-disable indent */
import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	CreateDateColumn,
	UpdateDateColumn,
	ManyToOne
} from 'typeorm'
import { IsNotEmpty, IsString, Length } from 'class-validator'
import { Category } from 'src/categories/entities/categories.entity'
import { Employee } from 'src/employee/entities/employee.entity'

@Entity('posts')
export class Post {
	@PrimaryGeneratedColumn()
	post_id: number

	/** Title of the post */
	@Column({ length: 500 })
	@IsNotEmpty()
	@IsString()
	@Length(1, 200)
	title: string

	/** Content of the post */
	@Column({ type: 'text' })
	@IsNotEmpty()
	@IsString()
	content: string

	/** The category it belongs to */
	@ManyToOne(() => Category, (category) => category.posts, { nullable: false })
	category: Category

	/** The employee who created the post */
	@ManyToOne(() => Employee, (employee) => employee.createdPosts, { nullable: false })
	createdBy: Employee

	/** Timestamps */
	@CreateDateColumn()
	createdAt: Date

	@UpdateDateColumn()
	updatedAt: Date
}
