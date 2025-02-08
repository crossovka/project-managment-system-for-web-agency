import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { Task } from '../entities/task.entity'
import { Position, TaskStatus } from 'src/types/types'

@Injectable()
export class TaskStatusGuard implements CanActivate {
	constructor(
		private reflector: Reflector,
		@InjectRepository(Task)
		private taskRepository: Repository<Task>
	) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest()
		const { user } = request
		const updateData = request.body
		const taskId = request.params.taskId

		// If not updating status, allow the operation
		if (!updateData.status) {
			return true
		}

		const currentTask = await this.taskRepository.findOne({
			where: { task_id: taskId }
		})

		if (!currentTask) {
			throw new ForbiddenException('Task not found')
		}

		if (currentTask.status === TaskStatus.COMPLETED) {
			throw new ForbiddenException('Cannot modify completed tasks')
		}

		const isManagerOrDirector = [Position.PROJECT_MANAGER, Position.DIRECTOR].includes(
			user.position
		)

		if (updateData.status === TaskStatus.COMPLETED) {
			if (!isManagerOrDirector) {
				// Automatically set to UNDER_REVIEW for non-managers
				updateData.status = TaskStatus.UNDER_REVIEW
			}
		}

		return true
	}
}
