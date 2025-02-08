import { Controller, Get, Post, Body, Param, Patch, UseGuards } from '@nestjs/common'
import { Logger } from '@nestjs/common'

import { TasksService } from './tasks.service'

import { CurrentUser } from 'src/decorators/CurrentUser.decorator'
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard'
import { TaskStatusGuard } from './guards/task-status.guard'
import { TaskAccessGuard } from './guards/task-access.guard'
import { CreateTaskDto } from './dto/create-task.dto'
import { UpdateTaskDto } from './dto/update-task.dto'
import { Position } from 'src/types/types'
import { EmployeeDto } from 'src/employee/dto/Employee.dto'
import { plainToInstance } from 'class-transformer'
import { TaskDto } from './dto/task.dto'

@Controller('tasks')
export class TasksController {
	private readonly logger = new Logger(TasksController.name)

	constructor(private readonly tasksService: TasksService) {}

	// Создание задачи
	@Post()
	async create(@Body() createTaskDto: CreateTaskDto) {
		return await this.tasksService.create(createTaskDto)
	}

	// Частичное обновление задачи
	@Patch(':taskId')
	@UseGuards(JwtAuthGuard, TaskStatusGuard, TaskAccessGuard)
	async update(@Param('taskId') taskId: number, @Body() updateTaskDto: UpdateTaskDto) {
		this.logger.log(`Received update request for taskId: ${taskId}`)
		return await this.tasksService.update(taskId, updateTaskDto)
	}

	// Получение задач сотрудника
	// @Get('employee/:employee_id')
	// @UseGuards(JwtAuthGuard)
	// async findTasksByEmployee(@Param('employee_id') employee_id: string) {
	// 	const id = parseInt(employee_id, 10)
	// 	if (isNaN(id)) {
	// 		throw new Error('employee_id должен быть числом')
	// 	}
	// 	return await this.tasksService.findTasksByEmployee(id)
	// }

	// Получение задач сотрудника
	@Get('employee/:employee_id')
	@UseGuards(JwtAuthGuard)
	async findTasksByEmployee(
		@Param('employee_id') employee_id: string,
		@CurrentUser() user: EmployeeDto
	) {
		// Преобразуем в число и проверяем на ошибку
		const id = parseInt(employee_id, 10)

		// Если не число, выбрасываем ошибку
		if (isNaN(id)) {
			throw new Error('employee_id должен быть числом')
		}

		// Роли, которым разрешен доступ ко всем задачам
		const allAccessRoles = [Position.DIRECTOR, Position.PROJECT_MANAGER]

		// Если пользователь не директор или проектный менеджер, он может видеть только свои задачи
		if (!allAccessRoles.includes(user.position) && user.employee_id !== id) {
			throw new Error('Доступ запрещен')
		}

		return await this.tasksService.findTasksByEmployee(id)
	}

	// Поиск задач по проекту
	@Get('project/:project_id')
	@UseGuards(JwtAuthGuard)
	async findTasksByProject(@Param('project_id') project_id: number) {
		if (isNaN(project_id)) {
			throw new Error('project_id должен быть числом')
		}
		return await this.tasksService.findTasksByProject(project_id)
	}

	// Получение задачи по ID
	@Get(':taskId')
	@UseGuards(JwtAuthGuard)
	async getTaskById(@Param('taskId') taskId: number): Promise<TaskDto> {
		const task = await this.tasksService.findTaskById(taskId)
		return plainToInstance(TaskDto, task, { excludeExtraneousValues: true })
	}
}
