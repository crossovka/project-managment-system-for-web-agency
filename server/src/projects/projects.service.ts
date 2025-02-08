import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { plainToInstance } from 'class-transformer'

import { throwIfNotFound } from 'src/utils/common'

import { Project } from './entities/project.entity'
import { Employee } from 'src/employee/entities/employee.entity'
import { Client } from 'src/clients/entities/client.entity'

import { CreateProjectDto } from './dto/create-project.dto'
import { ProjectDto } from './dto/project.dto'
import { ProjectMinimalWithStatusDto } from './dto/project-minimal-with-status.dto'
import { Department, Position, ProjectStatus, TaskStatus } from 'src/types/types'

@Injectable()
export class ProjectsService {
	constructor(
		@InjectRepository(Project) private readonly projectRepository: Repository<Project>,
		@InjectRepository(Employee) private readonly employeeRepository: Repository<Employee>,
		@InjectRepository(Client) private readonly clientRepository: Repository<Client>
	) {}

	async create(createProjectDto: CreateProjectDto): Promise<ProjectDto> {
		const existingProject = await this.projectRepository.findOne({
			where: { name: createProjectDto.name }
		})

		if (existingProject) {
			throw new BadRequestException(
				`Project with the name "${createProjectDto.name}" already exists.`
			)
		}

		const client = await this.clientRepository.findOne({
			where: { client_id: createProjectDto.client_id },
			relations: ['projects']
		})
		throwIfNotFound(client, `Client with id ${createProjectDto.client_id} not found`)

		const projectManager = await this.employeeRepository.findOne({
			where: { employee_id: createProjectDto.project_manager_id }
		})
		throwIfNotFound(
			projectManager,
			`Employee with id ${createProjectDto.project_manager_id} not found`
		)

		if (
			projectManager.position !== Position.PROJECT_MANAGER ||
			projectManager.department !== Department.PROJECT_MANAGEMENT
		) {
			throw new BadRequestException(
				'The project manager must have the correct position and department.'
			)
		}

		const employeePromises = createProjectDto.employees.map((employeeId) =>
			this.employeeRepository.findOne({
				where: { employee_id: employeeId }
			})
		)

		const employees = await Promise.all(employeePromises)
		employees.forEach((employee, index) => {
			// eslint-disable-next-line max-len
			throwIfNotFound(employee, `Employee with id ${createProjectDto.employees[index]} not found`)
		})

		const uniqueEmployeeIds = new Set(createProjectDto.employees)
		if (uniqueEmployeeIds.size !== createProjectDto.employees.length) {
			throw new BadRequestException('Duplicate employees are not allowed.')
		}

		// Добавляем проектного менеджера в начало массива сотрудников
		const allEmployees = [projectManager, ...employees]

		// Устанавливаем totalTurnover в 0, если оно не передано
		const totalTurnover = createProjectDto.totalTurnover ?? 0

		// Создаём новый проект с начальным статусом
		const project = this.projectRepository.create({
			name: createProjectDto.name,
			startDate: createProjectDto.startDate,
			endDate: createProjectDto.endDate,
			totalTurnover,
			accountsReceivable: createProjectDto.accountsReceivable,
			client,
			projectManager,
			employees: allEmployees,
			status: ProjectStatus.IN_PROGRESS, // Изначально проект будет в работе
			description: createProjectDto.description,
			importantInfo: createProjectDto.importantInfo
		})

		// Сохраняем проект
		const savedProject = await this.projectRepository.save(project)

		return plainToInstance(ProjectDto, savedProject, { excludeExtraneousValues: true })
	}

	// Метод для получения всех проектов с сотрудниками и проектным менеджером
	async findAll(): Promise<ProjectMinimalWithStatusDto[]> {
		// Загружаем проекты с их связями
		const projects = await this.projectRepository.find({
			relations: ['employees', 'projectManager', 'access', 'tasks']
		})

		// Если проекты не найдены, выбрасываем исключение
		throwIfNotFound(projects, 'Projects not found')

		// Cущности в DTO
		return projects.map((project) =>
			plainToInstance(ProjectMinimalWithStatusDto, project, { excludeExtraneousValues: true })
		)
	}

	// Метод для получения одного проекта
	async findOne(project_id: number): Promise<ProjectDto> {
		// Ищем проект по ID с его связями
		const project = await this.projectRepository.findOne({
			where: { project_id },
			// eslint-disable-next-line max-len
			relations: ['employees', 'projectManager', 'client', 'access', 'tasks', 'tasks.assignedTo']
		})

		// Если проект не найден, выбрасываем исключение
		throwIfNotFound(project, `Проект с ID ${project_id} не найден`)

		// Фильтруем задачи, исключая те, у которых статус "COMPLETED"
		if (project.tasks) {
			project.tasks = project.tasks.filter((task) => task.status !== TaskStatus.COMPLETED)
		}

		// Преобразуем проект в ProjectDto
		const projectDto = plainToInstance(ProjectDto, project, {
			excludeExtraneousValues: true
		})

		return projectDto
	}

	async getProjectsByEmployeeId(employeeId: number): Promise<ProjectMinimalWithStatusDto[]> {
		const employee = await this.employeeRepository.findOne({
			where: { employee_id: employeeId }
		})

		throwIfNotFound(employee, `Employee with ID ${employeeId} not found`)

		const projects = await this.projectRepository.find({
			where: { employees: { employee_id: employeeId } }
			// relations: [''],
		})

		return projects.map((project) =>
			plainToInstance(ProjectMinimalWithStatusDto, project, { excludeExtraneousValues: true })
		)
	}

	async updateProjectTurnover(projectId: number): Promise<ProjectDto> {
		const project = await this.projectRepository.findOne({
			where: { project_id: projectId },
			relations: ['tasks']
		})

		throwIfNotFound(project, `Project with ID ${projectId} not found`)

		// Инициализируем currentTurnover
		const currentTurnover = parseFloat(project.totalTurnover?.toString() || '0.00')

		// Фильтруем новые завершённые задачи (те, которые ранее не были завершены)
		const newCompletedTasks = project.tasks.filter(
			(task) => task.status === TaskStatus.COMPLETED && !task.turnedOver
		)

		// Если нет новых завершённых задач, возвращаем текущий проект
		if (newCompletedTasks.length === 0) {
			return plainToInstance(ProjectDto, project, { excludeExtraneousValues: true })
		}

		// Суммируем стоимость новых завершённых задач
		const totalTurnover = newCompletedTasks.reduce((sum, task) => {
			const cost = parseFloat(task.cost?.toString() || '0')
			if (!isNaN(cost) && cost > 0) {
				return sum + cost
			}
			return sum
		}, 0.0)

		// Округляем итоговый оборот
		const updatedTurnover = parseFloat(totalTurnover.toFixed(2))

		// Обновляем totalTurnover
		project.totalTurnover = currentTurnover + updatedTurnover

		// Устанавливаем accountsReceivable равным сумме новых завершённых задач
		project.accountsReceivable = updatedTurnover

		// Отмечаем задачи как учтённые
		newCompletedTasks.forEach((task) => {
			task.turnedOver = true
		})

		// Сохраняем проект
		const updatedProject = await this.projectRepository.save(project)

		return plainToInstance(ProjectDto, updatedProject, { excludeExtraneousValues: true })
	}

	async addPayment(projectId: number, amount: number): Promise<ProjectDto> {
		const project = await this.projectRepository.findOne({
			where: { project_id: projectId },
			relations: ['tasks']
		})

		throwIfNotFound(project, `Project with ID ${projectId} not found`)

		const currentAccountsReceivable = parseFloat(project.accountsReceivable?.toString() || '0.00')

		if (amount <= 0) {
			throw new BadRequestException('Amount must be positive')
		}

		if (currentAccountsReceivable < amount) {
			throw new BadRequestException('Insufficient funds in accounts receivable')
		}

		project.accountsReceivable = parseFloat((currentAccountsReceivable - amount).toFixed(2))

		const updatedProject = await this.projectRepository.save(project)

		return plainToInstance(ProjectDto, updatedProject, { excludeExtraneousValues: true })
	}

	async addEmployeeToProject(projectId: number, employeeId: number): Promise<ProjectDto> {
		// Проверяем, существует ли проект
		const project = await this.projectRepository.findOne({
			where: { project_id: projectId },
			relations: ['employees'] // Загружаем сотрудников проекта
		})
		throwIfNotFound(project, `Project with ID ${projectId} not found`)

		// Проверяем, существует ли сотрудник
		const employee = await this.employeeRepository.findOne({
			where: { employee_id: employeeId }
		})
		throwIfNotFound(employee, `Employee with ID ${employeeId} not found`)

		// Проверяем, не добавлен ли сотрудник уже в проект
		const isAlreadyInProject = project.employees.some((e) => e.employee_id === employeeId)
		if (isAlreadyInProject) {
			throw new BadRequestException(
				`Employee with ID ${employeeId} is already assigned to the project`
			)
		}

		// Добавляем сотрудника в проект
		project.employees.push(employee)

		// Сохраняем изменения
		const updatedProject = await this.projectRepository.save(project)

		// Возвращаем обновленный проект
		return plainToInstance(ProjectDto, updatedProject, { excludeExtraneousValues: true })
	}

	async updateProjectManager(projectId: number, managerId: number): Promise<ProjectDto> {
		// Находим проект
		const project = await this.projectRepository.findOne({
			where: { project_id: projectId },
			relations: ['employees', 'projectManager']
		})
		throwIfNotFound(project, `Project with ID ${projectId} not found`)

		// Проверяем, существует ли сотрудник
		const manager = await this.employeeRepository.findOne({
			where: { employee_id: managerId }
		})
		throwIfNotFound(manager, `Employee with ID ${managerId} not found`)

		// Устанавливаем нового менеджера проекта
		project.projectManager = manager

		// Проверяем, есть ли менеджер в списке сотрудников
		const isAlreadyEmployee = project.employees.some((e) => e.employee_id === managerId)
		if (!isAlreadyEmployee) {
			project.employees.unshift(manager) // Добавляем менеджера в начало
		}

		// Сохраняем изменения
		const updatedProject = await this.projectRepository.save(project)

		// Возвращаем обновленный проект
		return plainToInstance(ProjectDto, updatedProject, { excludeExtraneousValues: true })
	}

	// Метод для обновления описания проекта
	async updateProjectDescription(projectId: number, description: string): Promise<ProjectDto> {
		const options = {
			where: { project_id: projectId },
			relations: ['employees', 'projectManager', 'client', 'access', 'tasks', 'tasks.assignedTo']
		}

		const project = await this.projectRepository.findOne(options)

		throwIfNotFound(project, `Project with ID ${projectId} not found`)

		project.description = description
		const updatedProject = await this.projectRepository.save(project)

		return plainToInstance(ProjectDto, updatedProject, { excludeExtraneousValues: true })
	}

	// Метод для обновления важной информации проекта
	async updateProjectImportantInfo(projectId: number, importantInfo: string): Promise<ProjectDto> {
		const options = {
			where: { project_id: projectId },
			relations: ['employees', 'projectManager', 'client', 'access', 'tasks', 'tasks.assignedTo']
		}

		const project = await this.projectRepository.findOne(options)

		throwIfNotFound(project, `Project with ID ${projectId} not found`)

		project.importantInfo = importantInfo
		const updatedProject = await this.projectRepository.save(project)

		return plainToInstance(ProjectDto, updatedProject, { excludeExtraneousValues: true })
	}

	// Метод для обновления статуса проекта
	async updateProjectStatus(projectId: number, status: ProjectStatus): Promise<ProjectDto> {
		const options = {
			where: { project_id: projectId },
			relations: ['employees', 'projectManager', 'client', 'access', 'tasks', 'tasks.assignedTo']
		}

		const project = await this.projectRepository.findOne(options)

		throwIfNotFound(project, `Project with ID ${projectId} not found`)

		project.status = status
		const updatedProject = await this.projectRepository.save(project)

		return plainToInstance(ProjectDto, updatedProject, { excludeExtraneousValues: true })
	}
}
