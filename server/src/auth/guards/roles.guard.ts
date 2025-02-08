import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common'
import { Observable } from 'rxjs'
import { Reflector } from '@nestjs/core'
import { Position } from 'src/types/types'
import { throwIfNotFound } from 'src/utils/common'

@Injectable()
export class RolesGuard implements CanActivate {
	constructor(private reflector: Reflector) {}

	canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
		const requiredRole = this.reflector.get<Position>('role', context.getHandler())
		if (!requiredRole) {
			return true // Если роль не задана, доступ разрешен
		}

		const request = context.switchToHttp().getRequest()
		const employee = request.user // Получаем пользователя из JWT
		// console.log('Request user:', employee) // Логи для отладки

		throwIfNotFound(employee, 'Employee not found in request.user')

		// console.log('User role:', employee.position) // Для отладки
		const hasRole = requiredRole.includes(employee.position)
		if (!hasRole) {
			throw new ForbiddenException('User does not have the required permissions')
		}
		return true // Роль совпадает
	}
}
