import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { throwIfDuplicate, throwIfNotFound } from 'src/utils/common'

import { Category } from './entities/categories.entity'

import { CreateCategoryDto } from './dto/CreateCategory.dto'
import { UpdateCategoryDto } from './dto/UpdateCategory.dto'

@Injectable()
export class CategoriesService {
	constructor(
		@InjectRepository(Category)
		private readonly categoryRepository: Repository<Category>
	) {}

	async create(createCategoryDto: CreateCategoryDto) {
		const { name } = createCategoryDto

		const existingCategory = await this.categoryRepository.findOne({ where: { name } })
		throwIfDuplicate(existingCategory, `Category with name "${name}" already exists`)

		const category = this.categoryRepository.create(createCategoryDto)
		return await this.categoryRepository.save(category)
	}

	async findAll() {
		return await this.categoryRepository.find()
	}

	async findOne(id: number) {
		const category = await this.categoryRepository.findOne({
			where: { category_id: id },
			relations: ['']
		})

		throwIfNotFound(category, `Category with ID ${id} not found`)

		return category
	}

	async update(id: number, updateCategoryDto: UpdateCategoryDto) {
		const category = await this.findOne(id)
		const updatedCategory = Object.assign(category, updateCategoryDto)
		return await this.categoryRepository.save(updatedCategory)
	}

	async remove(id: number) {
		const category = await this.findOne(id)
		return await this.categoryRepository.remove(category)
	}
}
