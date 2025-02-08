import {
	Controller,
	Post,
	UseGuards,
	Request,
	Get,
	ForbiddenException,
	Param
} from '@nestjs/common'
import { AuthService } from './auth.service'
import { LocalAuthGuard } from './guards/local-auth.guard'
import { JwtAuthGuard } from './guards/jwt-auth.guard'
import { Position } from 'src/types/types'
import { RolesGuard } from './guards/roles.guard'

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@UseGuards(LocalAuthGuard)
	@Post('/login')
	async login(@Request() req) {
		// return req.employee
		const { ...safeUser } = req.user
		return this.authService.login(safeUser)
	}

	// Защищенный маршрут для получения профиля
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Get('profile/:employee_id?') // Параметр employee_id необязательный
	async getProfile(@Request() req, @Param('employee_id') employeeId?: number) {
		const requestingUserId = req.user.employee_id
		const userPosition = req.user.position // Используем position вместо role

		console.log('Получен запрос на получение профиля')
		console.log(req.user)
		console.log('ID запрашивающего пользователя:', requestingUserId)
		console.log('Должность запрашивающего пользователя:', userPosition) // Роль заменена на должность
		console.log('Запрашиваемый employeeId:', employeeId)

		// Если employeeId не указан, возвращаем профиль текущего пользователя
		if (!employeeId) {
			console.log('employeeId не указан. Возвращаем профиль текущего пользователя.')
			return this.authService.getProfile(requestingUserId)
		}

		// Проверяем, есть ли права на просмотр чужого профиля
		if ([Position.DIRECTOR, Position.PROJECT_MANAGER].includes(userPosition)) {
			// Проверяем должность
			console.log('Пользователь имеет права для просмотра чужих профилей')
			return this.authService.getProfile(employeeId)
		}

		// Если прав недостаточно, бросаем ошибку
		console.log('Доступ запрещен. Должность пользователя не позволяет запрашивать чужие профили.')
		throw new ForbiddenException('Access denied')
	}
}
