// src/categories/category.controller.ts
import {
	Controller,
	Post,
	Get,
	Put,
	Delete,
	Param,
	Body,
	UsePipes,
	ValidationPipe,
	UseGuards
} from '@nestjs/common'

import { CategoriesService } from './categories.service'

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { RolesGuard } from '../auth/guards/roles.guard'
import { Roles } from 'src/decorators/roles.decorator'

import { CreateCategoryDto } from './dto/CreateCategory.dto'
import { UpdateCategoryDto } from './dto/UpdateCategory.dto'
import { Position } from '../types/types'

@Controller('categories')
export class CategoriesController {
	constructor(private readonly categoryService: CategoriesService) {}

	@UseGuards(JwtAuthGuard
		// RolesGuard
	)
	// @Roles(Position.DIRECTOR, Position.PROJECT_MANAGER)
	@Post()
	@UsePipes(new ValidationPipe())
	create(@Body() createCategoryDto: CreateCategoryDto) {
		return this.categoryService.create(createCategoryDto)
	}

	@UseGuards(JwtAuthGuard
		// RolesGuard
	)
	// @Roles(Position.DIRECTOR, Position.PROJECT_MANAGER)
	@Get()
	async findAll() {
		return await this.categoryService.findAll()
	}

	@UseGuards(JwtAuthGuard,)
	// @Roles(Position.DIRECTOR, Position.PROJECT_MANAGER)
	@Get(':id')
	async findOne(@Param('id') id: number) {
		return await this.categoryService.findOne(id)
	}

	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(Position.DIRECTOR, Position.PROJECT_MANAGER)
	@Put(':id')
	@UsePipes(new ValidationPipe())
	async update(@Param('id') id: number, @Body() updateCategoryDto: UpdateCategoryDto) {
		return await this.categoryService.update(id, updateCategoryDto)
	}

	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(Position.DIRECTOR, Position.PROJECT_MANAGER)
	@Delete(':id')
	async remove(@Param('id') id: number) {
		return await this.categoryService.remove(id)
	}
}
