import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common'
import { ProjectsService } from '../projects.service'
import { Position } from 'src/types/types'

@Injectable()
export class ProjectAccessGuard implements CanActivate {
	constructor(private readonly projectsService: ProjectsService) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest()
		const user = request.user
		const projectId = parseInt(request.params.id, 10)

		// Получаем проект
		const project = await this.projectsService.findOne(projectId)

		// Проверяем, является ли пользователь директором
		if (user.position === Position.DIRECTOR) {
			return true
		}

		// Проверяем, является ли пользователь менеджером проекта
		if (project.projectManager && project.projectManager.employee_id === user.employee_id) {
			return true
		}

		// Проверяем, является ли пользователь участником проекта
		if (
			project.employees &&
			project.employees.some((employee) => employee.employee_id === user.employee_id)
		) {
			return true
		}

		// Если ни одно из условий не выполнено, запрещаем доступ
		throw new ForbiddenException('У вас нет доступа к этому проекту')
	}
}
