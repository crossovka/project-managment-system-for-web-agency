import {
	BadRequestException,
	ForbiddenException,
	Injectable,
	NotFoundException
} from '@nestjs/common'
import { plainToClass, plainToInstance } from 'class-transformer'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { Task } from './entities/task.entity'
import { Employee } from 'src/employee/entities/employee.entity'
import { Project } from 'src/projects/entities/project.entity'

import { ProjectsService } from 'src/projects/projects.service'
import { EmployeeStatisticService } from 'src/employee-statistic/employee-statistic.service'

import { CreateTaskDto } from './dto/create-task.dto'
import { UpdateTaskDto } from './dto/update-task.dto'
import { TaskDto } from './dto/task.dto'

import { throwIfDuplicate, throwIfNotFound } from 'src/utils/common'
import { Position, TaskStatus, WorkType } from 'src/types/types'

@Injectable()
export class TasksService {
	constructor(
		@InjectRepository(Task) private readonly taskRepository: Repository<Task>,
		@InjectRepository(Employee) private readonly employeeRepository: Repository<Employee>,
		@InjectRepository(Project) private readonly projectRepository: Repository<Project>,
		private readonly projectsService: ProjectsService,
		private readonly employeeStatisticService: EmployeeStatisticService
	) {}

	async create(createTaskDto: CreateTaskDto): Promise<TaskDto> {
		const {
			createdBy,
			assignedTo,
			project_id,
			workType,
			title,
			description,
			startDate,
			dueDate,
			cost,
			hours,
			minutes
		} = createTaskDto

		const [creator, project, duplicateTask] = await Promise.all([
			this.employeeRepository.findOne({
				where: { employee_id: createdBy },
				relations: ['projects']
			}),
			this.projectRepository.findOne({ where: { project_id } }),
			this.taskRepository.findOne({ where: { title } })
		])

		throwIfNotFound(creator, 'Creator not found')
		throwIfNotFound(project, 'Project not found')
		throwIfDuplicate(duplicateTask, 'Task with the same title already exists')

		const isManagerOrDirector = [Position.PROJECT_MANAGER, Position.DIRECTOR].includes(
			creator.position
		)

		if (!isManagerOrDirector && assignedTo !== createdBy) {
			throw new ForbiddenException('Only project managers or directors can assign tasks to others.')
		}

		let assignee = creator
		if (assignedTo) {
			assignee = await this.employeeRepository.findOne({
				where: { employee_id: assignedTo },
				relations: ['projects']
			})
			throwIfNotFound(assignee, 'Assigned employee not found')

			// Убедитесь, что сотрудник участвует в проекте
			if (!assignee.projects.some((proj) => proj.project_id === project.project_id)) {
				assignee.projects = [...assignee.projects, project]
				await this.employeeRepository.save(assignee)
			}
		}

		const task = this.taskRepository.create({
			title,
			description,
			startDate,
			dueDate,
			project,
			status: createTaskDto.status || TaskStatus.IN_PROGRESS,
			workType: workType || WorkType.PROJECT_BASED,
			createdBy: creator,
			assignedTo: assignee,
			cost: cost || 0,
			hours: hours || 0,
			minutes: minutes || 0
		})

		const savedTask = await this.taskRepository.save(task)

		if (task.status === TaskStatus.COMPLETED) {
			await this.projectsService.updateProjectTurnover(task.project.project_id)
			await this.employeeStatisticService.updateEmployeeStatistics(task.assignedTo.employee_id)
		}

		return plainToClass(TaskDto, savedTask, { excludeExtraneousValues: true })
	}

	async update(taskId: number, updateTaskDto: UpdateTaskDto): Promise<TaskDto> {
		const {
			createdBy,
			assignedTo,
			project_id,
			status,
			workType,
			hours,
			minutes,
			title,
			description,
			startDate,
			dueDate,
			cost
		} = updateTaskDto

		// Валидация: проверяем, что project_id, assignedTo, createdBy являются числами
		if (project_id != null && (isNaN(project_id) || typeof project_id !== 'number')) {
			throw new BadRequestException('project_id должен быть числом')
		}
		if (
			assignedTo?.employee_id != null &&
			(isNaN(assignedTo.employee_id) || typeof assignedTo.employee_id !== 'number')
		) {
			throw new BadRequestException('assignedTo должен быть числом')
		}
		if (
			createdBy?.employee_id != null &&
			(isNaN(createdBy.employee_id) || typeof createdBy.employee_id !== 'number')
		) {
			throw new BadRequestException('createdBy должен быть числом')
		}

		console.log('Finding related entities...')

		// Find related entities
		const [assignedEmployee, creator, project] = await Promise.all([
			assignedTo?.employee_id
				? this.employeeRepository.findOne({ where: { employee_id: assignedTo.employee_id } })
				: Promise.resolve(null),
			createdBy?.employee_id
				? this.employeeRepository.findOne({ where: { employee_id: createdBy.employee_id } })
				: Promise.resolve(null),
			project_id ? this.projectRepository.findOne({ where: { project_id } }) : Promise.resolve(null)
		])

		console.log('AssignedEmployee:', assignedEmployee)
		console.log('Creator:', creator)
		console.log('Project:', project)

		// Validate entities exist
		if (createdBy?.employee_id && !creator) {
			throw new NotFoundException('Creator not found')
		}
		if (assignedTo?.employee_id && !assignedEmployee) {
			throw new NotFoundException('Assigned employee not found')
		}
		if (project_id && !project) {
			throw new NotFoundException('Project not found')
		}

		console.log('Finding task...')

		// Find task
		const task = await this.taskRepository.findOne({
			where: { task_id: taskId },
			relations: ['project', 'assignedTo', 'createdBy']
		})
		if (!task) {
			throw new NotFoundException('Task not found')
		}

		console.log('Updating task...')

		// Update task
		Object.assign(task, {
			title: title || task.title,
			description: description || task.description,
			startDate: startDate || task.startDate,
			dueDate: dueDate || task.dueDate,
			status: status || task.status,
			workType: workType || task.workType,
			hours: hours || task.hours,
			minutes: minutes || task.minutes,
			cost: cost || task.cost,
			assignedTo: assignedEmployee || task.assignedTo,
			createdBy: creator || task.createdBy,
			project: project || task.project
		})

		console.log('Saving task...')

		// Сохраняем изменения в задаче
		await this.taskRepository.save(task)

		console.log('Task saved successfully')

		if (updateTaskDto.status === TaskStatus.COMPLETED) {
			console.log('Task status changed to completed. Updating project turnover...')
			await this.projectsService.updateProjectTurnover(task.project.project_id)
			// eslint-disable-next-line max-len
			await this.employeeStatisticService.updateEmployeeStatistics(task.assignedTo.employee_id)
		}

		console.log('Fetching updated task...')

		// Получаем обновлённую задачу с отношениями
		const updatedTask = await this.taskRepository.findOne({
			where: { task_id: taskId },
			relations: ['project', 'assignedTo', 'createdBy']
		})

		console.log('Task updated successfully')
		return plainToClass(TaskDto, updatedTask, { excludeExtraneousValues: true })
	}

	// Получение задач по сотруднику
	async findTasksByEmployee(employee_id: number): Promise<TaskDto[]> {
		const tasks = await this.taskRepository.find({
			where: { assignedTo: { employee_id } },
			relations: ['assignedTo', 'createdBy', 'project']
		})

		// Если задач нет, возвращаем пустой массив
		if (!tasks.length) {
			return []
		}

		// eslint-disable-next-line max-len
		return tasks.map((task) => plainToInstance(TaskDto, task, { excludeExtraneousValues: true }))
	}

	// Получение задач по проекту
	async findTasksByProject(project_id: number): Promise<TaskDto[]> {
		// Ищем проект по ID
		const project = await this.projectRepository.findOne({
			where: { project_id },
			relations: ['tasks', 'tasks.assignedTo', 'tasks.createdBy', 'tasks.project']
		})
		// console.log('Found project:', project)

		throwIfNotFound(project, `Project with ID ${project_id} not found`)

		// Задачи уже находятся внутри проекта
		const tasks = project.tasks

		// console.log('Found tasks:', tasks)

		// Если задачи не найдены, выбрасываем исключение
		// if (!tasks || tasks.length === 0) {
		// 	throw new NotFoundException(`Tasks for project with ID ${project_id} not found.`)
		// }
		// Если задач нет, возвращаем пустой массив
		if (!tasks.length) {
			return []
		}

		// Преобразуем задачи в DTO и возвращаем их
		// eslint-disable-next-line max-len
		return tasks.map((task) => plainToInstance(TaskDto, task, { excludeExtraneousValues: true }))
	}

	async findTaskById(taskId: number): Promise<Task> {
		const task = await this.taskRepository.findOne({
			where: { task_id: taskId },
			relations: ['assignedTo', 'createdBy', 'project']
		})

		throwIfNotFound(task, `Task with ID ${taskId} not found`)

		return task
	}
}
