// src/posts/post.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { plainToInstance } from 'class-transformer'

import { Post } from './entities/posts.entity'
import { Employee } from 'src/employee/entities/employee.entity'
import { Category } from 'src/categories/entities/categories.entity'

import { throwIfNotFound } from 'src/utils/common'

import { CreatePostDto } from './dto/CreatePost.dto'
import { UpdatePostDto } from './dto/UpdatePost.dto'
import { PostDto } from './dto/Post.dto'
import { Position } from 'src/types/types'
import { PostFullDto } from './dto/PostFull.dto'

@Injectable()
export class PostsService {
	constructor(
		@InjectRepository(Post)
		private readonly postRepository: Repository<Post>,
		@InjectRepository(Employee)
		private readonly employeeRepository: Repository<Employee>,
		@InjectRepository(Category)
		private readonly categoriesRepository: Repository<Category>
	) {}

	async create(createPostDto: CreatePostDto, employeeId: number) {
		const employee = await this.employeeRepository.findOne({
			where: { employee_id: employeeId }
		})
		throwIfNotFound(employee, `Employee with ID ${employeeId} not found`)

		const category = await this.categoriesRepository.findOne({
			where: { category_id: createPostDto.category_id }
		})
		throwIfNotFound(category, `Category with ID ${createPostDto.category_id} not found`)

		const post = this.postRepository.create({
			...createPostDto,
			createdBy: employee,
			category: category
		})

		const savedPost = await this.postRepository.save(post)

		return plainToInstance(PostDto, savedPost)
	}

	async findAll() {
		const posts = await this.postRepository.find({
			relations: ['category', 'createdBy'],
			order: { createdAt: 'DESC' } // Сортировка по дате создания (новые сначала)
		})
		console.log(posts)
		return plainToInstance(PostDto, posts, {
			excludeExtraneousValues: true
		})
	}

	async findOne(id: number) {
		const post = await this.postRepository.findOne({
			where: { post_id: id },
			relations: ['category', 'createdBy']
		})
		throwIfNotFound(post, `Post with ID ${id} not found`)

		// console.log(post)
		return plainToInstance(PostFullDto, post, {
			excludeExtraneousValues: true
		})
	}

	async update(id: number, updatePostDto: UpdatePostDto, employeeId: number) {
		// Find the post by ID
		const post = await this.postRepository.findOne({
			where: { post_id: id },
			relations: ['createdBy']
		})

		// Check if the post exists
		throwIfNotFound(post, `Post with ID ${id} not found`)

		// Check if the employee is the author or is a director
		if (post.createdBy.employee_id !== employeeId) {
			const employee = await this.employeeRepository.findOne({
				where: { employee_id: employeeId },
				select: ['position']
			})

			if (!employee || employee.position !== Position.DIRECTOR) {
				throw new UnauthorizedException(
					'You can only update your own posts or have the director role'
				)
			}
		}

		// Find and set the new category if provided
		if (updatePostDto.category_id) {
			const category = await this.categoriesRepository.findOne({
				where: { category_id: updatePostDto.category_id }
			})
			throwIfNotFound(category, `Category not found`)
			post.category = category
		}

		// Update the post fields
		Object.assign(post, updatePostDto)

		// Save the updated post
		return await this.postRepository.save(post)
	}

	async remove(id: number, employeeId: number) {
		// Find the post by ID with related entities
		const post = await this.postRepository.findOne({
			where: { post_id: id },
			relations: ['createdBy']
		})

		// Check if the post exists
		throwIfNotFound(post, `Post with ID ${id} not found`)

		// Check if the employee is the author or is a director
		if (post.createdBy.employee_id !== employeeId) {
			const employee = await this.employeeRepository.findOne({
				where: { employee_id: employeeId },
				select: ['position']
			})

			if (!employee || employee.position !== Position.DIRECTOR) {
				throw new UnauthorizedException(
					'You can only delete your own posts or have the director role'
				)
			}
		}

		// Delete the post
		return await this.postRepository.remove(post)
	}
}
