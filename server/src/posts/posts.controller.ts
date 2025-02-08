import {
	Controller,
	Post,
	Get,
	Put,
	Delete,
	Param,
	Body,
	UseGuards,
	UsePipes,
	ValidationPipe,
	Request
} from '@nestjs/common'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { RolesGuard } from '../auth/guards/roles.guard'
import { Roles } from 'src/decorators/roles.decorator'

import { PostsService } from './posts.service'

import { CreatePostDto } from './dto/CreatePost.dto'
import { UpdatePostDto } from './dto/UpdatePost.dto'
import { Position } from '../types/types'

@Controller('posts')
export class PostsController {
	constructor(private readonly postService: PostsService) {}

	@UseGuards(
		JwtAuthGuard
		// RolesGuard
	)
	// @Roles(Position.DIRECTOR, Position.PROJECT_MANAGER)
	@Post()
	@UsePipes(new ValidationPipe())
	async create(@Body() createPostDto: CreatePostDto, @Request() req) {
		const employeeId = req.user.employee_id
		return this.postService.create(createPostDto, employeeId)
	}

	@UseGuards(JwtAuthGuard)
	@Get()
	async findAll() {
		return await this.postService.findAll()
	}

	@UseGuards(JwtAuthGuard)
	@Get(':id')
	async findOne(@Param('id') id: number) {
		return await this.postService.findOne(id)
	}

	@UseGuards(JwtAuthGuard)
	@Put(':id')
	@UsePipes(new ValidationPipe())
	async update(@Param('id') id: number, @Body() updatePostDto: UpdatePostDto, @Request() req) {
		const employeeId = req.user.employee_id
		return await this.postService.update(id, updatePostDto, employeeId)
	}

	@UseGuards(JwtAuthGuard)
	@Delete(':id')
	async remove(@Param('id') id: number, @Request() req) {
		const employeeId = req.user.employee_id
		return await this.postService.remove(id, employeeId)
	}
}
