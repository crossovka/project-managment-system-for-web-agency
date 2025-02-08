import { Controller, Post, Body, Get, Param, UseGuards, Patch } from '@nestjs/common'
import { ProjectsService } from './projects.service'
import { plainToInstance } from 'class-transformer'

import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard'
import { RolesGuard } from 'src/auth/guards/roles.guard'
import { ProjectAccessGuard } from './guards/project-access.guard'
import { CreateProjectDto } from './dto/create-project.dto'
import { ProjectDto } from './dto/project.dto'
import { Position, ProjectStatus } from 'src/types/types'
import { Roles } from 'src/decorators/roles.decorator'
import { ProjectMinimalWithStatusDto } from './dto/project-minimal-with-status.dto'
import { throwIfNotFound } from 'src/utils/common'

@Controller('projects')
export class ProjectsController {
	constructor(private readonly projectsService: ProjectsService) {}

	// Создание нового проекта
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(Position.DIRECTOR)
	@Post()
	async create(@Body() createProjectDto: CreateProjectDto) {
		const project = await this.projectsService.create(createProjectDto)
		return project
	}

	// Получение всех проектов
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(Position.PROJECT_MANAGER, Position.DIRECTOR)
	@Get()
	async findAll() {
		const projects = await this.projectsService.findAll()
		return projects
	}

	// Получение проекта по ID
	// @Get(':id')
	// async getProjectById(@Param('id') id: number): Promise<Project> {
	// 	return await this.projectsService.findOne(id)
	// }
	@Get(':id')
	@UseGuards(JwtAuthGuard, ProjectAccessGuard)
	async getProject(@Param('id') id: number): Promise<ProjectDto> {
		const project = await this.projectsService.findOne(id)
		return plainToInstance(ProjectDto, project, { excludeExtraneousValues: true })
	}

	@Get(':id/name')
	@UseGuards(JwtAuthGuard)
	async getProjectName(@Param('id') id: number): Promise<string> {
		const project = await this.projectsService.findOne(id)

		throwIfNotFound(project, `Project with ID ${id} not found`)

		return project.name // Возвращаем только имя проекта
	}

	@UseGuards(JwtAuthGuard)
	@Get('employee/:employeeId')
	async getProjectsByEmployee(
		@Param('employeeId') employeeId: number
	): Promise<ProjectMinimalWithStatusDto[]> {
		return await this.projectsService.getProjectsByEmployeeId(employeeId)
	}

	// Добавление сотрудника в проект
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(Position.PROJECT_MANAGER, Position.DIRECTOR)
	@Patch(':id/employees')
	async addEmployeeToProject(
		@Param('id') projectId: number,
		@Body('employeeId') employeeId: number
	): Promise<ProjectDto> {
		// eslint-disable-next-line max-len
		const updatedProject = await this.projectsService.addEmployeeToProject(projectId, employeeId)
		return updatedProject
	}

	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(Position.DIRECTOR)
	@Patch(':id/manager')
	async updateProjectManager(
		@Param('id') projectId: number,
		@Body('managerId') managerId: number
	): Promise<ProjectDto> {
		const updatedProject = await this.projectsService.updateProjectManager(projectId, managerId)
		return updatedProject
	}

	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(Position.DIRECTOR)
	@Post(':id/add-payment')
	async addPayment(
		@Param('id') projectId: number,
		@Body('amount') amount: number
	): Promise<ProjectDto> {
		return this.projectsService.addPayment(projectId, amount)
	}

	// Обновление описания проекта
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(Position.PROJECT_MANAGER, Position.DIRECTOR)
	@Patch(':id/description')
	async updateProjectDescription(
		@Param('id') projectId: number,
		@Body('description') description: string
	): Promise<ProjectDto> {
		const updatedProject = await this.projectsService.updateProjectDescription(
			projectId,
			description
		)
		return updatedProject
	}

	// Обновление важной информации проекта
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(Position.PROJECT_MANAGER, Position.DIRECTOR)
	@Patch(':id/important-info')
	async updateProjectImportantInfo(
		@Param('id') projectId: number,
		@Body('importantInfo') importantInfo: string
	): Promise<ProjectDto> {
		const updatedProject = await this.projectsService.updateProjectImportantInfo(
			projectId,
			importantInfo
		)
		return updatedProject
	}

	// Обновление статуса проекта
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(Position.PROJECT_MANAGER, Position.DIRECTOR)
	@Patch(':id/status')
	async updateProjectStatus(
		@Param('id') projectId: number,
		@Body('status') status: ProjectStatus
	): Promise<ProjectDto> {
		const updatedProject = await this.projectsService.updateProjectStatus(projectId, status)
		return updatedProject
	}
}
