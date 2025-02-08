import { UnauthorizedException, Injectable } from '@nestjs/common'
import { plainToInstance } from 'class-transformer'
import { EmployeeService } from '../employee/employee.service'
import * as argon2 from 'argon2'
import { JwtService } from '@nestjs/jwt'

import { throwIfNotFound } from 'src/utils/common'

// import { EmployeeProjectDto } from 'src/projects/dto/employee-project.dto'
import { EmployeeStatisticDto } from 'src/employee-statistic/dto/employee-statisctic.dto'
import { EmployeeWithProjectsDto } from 'src/employee/dto/employee-with-projects.dto'
import { Employee } from 'src/employee/entities/employee.entity'

@Injectable()
export class AuthService {
	constructor(
		private readonly EmployeeService: EmployeeService,
		private readonly jwtService: JwtService
	) {}

	async validateEmployee(name: string, password: string): Promise<Employee> {
		const employee = await this.EmployeeService.findOne(name)
		// throwIfNotFound(employee, 'Ползователь не найден')
		throwIfNotFound(employee, 'Пользователь или пароль неправильный')

		const isPasswordMatch = await argon2.verify(employee.password, password)
		if (!isPasswordMatch) {
			throw new UnauthorizedException('Пользователь или пароль неправильный')
		}

		return employee
	}

	async login(employee: Employee) {
		const { employee_id, name, position } = employee
		return {
			employee_id,
			name,
			position, // Включите информацию о роли
			token: this.jwtService.sign({ employee_id, name, position })
		}
	}

	// метод для получения профиля сотрудника
	async getProfile(employee_id: number): Promise<{
		employee: EmployeeWithProjectsDto
		employeeStatistic: EmployeeStatisticDto
	}> {
		try {
			// Получаем сотрудника с проектами
			const employee = await this.EmployeeService.findEmployeeById(employee_id, ['projects'])
			if (!employee) {
				throw new UnauthorizedException('Employee not found')
			}

			// Получаем статистику сотрудника
			// eslint-disable-next-line max-len
			const employeeStatistic = await this.EmployeeService.findEmployeeStatisticById(employee_id)
			// eslint-disable-next-line max-len
			throwIfNotFound(employeeStatistic, `Statistic not found for employee_id: ${employee_id}`)

			// Преобразуем данные сотрудника и статистики в DTO
			const employeeData = plainToInstance(EmployeeWithProjectsDto, employee, {
				excludeExtraneousValues: true
			})
			const employeeStatisticData = plainToInstance(EmployeeStatisticDto, employeeStatistic, {
				excludeExtraneousValues: true
			})

			// Возвращаем преобразованные данные
			return {
				employee: employeeData,
				employeeStatistic: employeeStatisticData
			}
		} catch (error) {
			// Обрабатываем ошибки, если они возникли в процессе получения данных
			throw error
		}
	}
}
