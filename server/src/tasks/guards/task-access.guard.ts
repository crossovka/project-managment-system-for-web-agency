import {
	Injectable,
	CanActivate,
	ExecutionContext,
	ForbiddenException,
	NotFoundException
} from '@nestjs/common'
import { Task } from '../entities/task.entity'
import { Position } from 'src/types/types'
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'

@Injectable()
export class TaskAccessGuard implements CanActivate {
	constructor(@InjectRepository(Task) private readonly taskRepository: Repository<Task>) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest()
		const user = request.user

		const taskId = parseInt(request.params.taskId, 10);

		const task = await this.taskRepository.findOne({
			where: { task_id: taskId },
			relations: ['project', 'assignedTo', 'createdBy']
		})
		if (!task) {
			throw new NotFoundException('Task not found')
		}

		// Проверяем, является ли пользователь создателем задачи
		if (task.createdBy.employee_id === user.employee_id) {
			return true
		}

		// Проверяем, является ли пользователь назначенным сотрудником
		if (task.assignedTo.employee_id === user.employee_id) {
			return true
		}

		// Проверяем, является ли пользователь директором
		if (user.position === Position.DIRECTOR) {
			return true
		}

		// Проверяем, является ли пользователь менеджером проекта
		if (
			task.project.projectManager &&
			task.project.projectManager.employee_id === user.employee_id
		) {
			return true
		}

		// Если ни одно из условий не выполнено, запрещаем доступ
		throw new ForbiddenException('У вас нет прав на редактирование этой задачи')
	}
}
