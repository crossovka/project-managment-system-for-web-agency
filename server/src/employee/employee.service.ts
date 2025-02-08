import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import * as argon2 from 'argon2'

import { throwIfDuplicate, throwIfNotFound } from 'src/utils/common'
import { InvalidPositionException } from 'src/exceptions/invalid-position.exception'

import { CreateEmployeeDto } from './dto/create-employee.dto'
// import { UpdateEmployeeDto } from './dto/update-employee.dto'
import { Employee } from './entities/employee.entity'
import { EmployeeStatistic } from 'src/employee-statistic/entities/employee-statistic.entity'
import { EmployeeStatisticDto } from 'src/employee-statistic/dto/employee-statisctic.dto'
import { EmployeeDto } from './dto/Employee.dto'
import { plainToInstance } from 'class-transformer'
import { UpdateEmployeeDto } from './dto/update-employee.dto'
import { departmentPositionMap } from 'src/types/employeeMappings'
import { Position } from 'src/types/types'

@Injectable()
export class EmployeeService {
	constructor(
		@InjectRepository(Employee) private readonly employeeRepository: Repository<Employee>,
		@InjectRepository(EmployeeStatistic)
		private readonly statisticRepository: Repository<EmployeeStatistic>
	) {}

	async create(createEmployeeDto: CreateEmployeeDto) {
		const isEmployeeExist = await this.employeeRepository.findOne({
			where: { name: createEmployeeDto.name }
		})
		throwIfDuplicate(isEmployeeExist, 'Employee already exists')

		// Проверка должности и отдела
		const allowedPositions = departmentPositionMap[createEmployeeDto.department]
		if (!allowedPositions || !allowedPositions.includes(createEmployeeDto.position)) {
			throw new InvalidPositionException(createEmployeeDto.position, createEmployeeDto.department)
		}

		// Создаем сотрудника
		const employee = await this.employeeRepository.save({
			name: createEmployeeDto.name,
			position: createEmployeeDto.position,
			department: createEmployeeDto.department,
			password: await argon2.hash(createEmployeeDto.password),
			hourlyRate: createEmployeeDto.hourlyRate
		})

		// Создаем статистику
		const employeeStatistic = this.statisticRepository.create({
			totalEarnings: 0,
			pendingEarnings: 0,
			monthlyEarnings: 0,
			hoursWorked: 0,
			employee: employee
		})

		await this.statisticRepository.save(employeeStatistic)

		const serializedEmployee = plainToInstance(EmployeeDto, employee)
		const serializedStatistic = plainToInstance(EmployeeStatisticDto, employeeStatistic)

		return {
			employee: serializedEmployee,
			employeeStatistic: serializedStatistic
		}
	}

	async update(employee_id: number, updateEmployeeDto: UpdateEmployeeDto) {
		const employee = await this.employeeRepository.findOne({ where: { employee_id } })
		throwIfNotFound(employee, `Employee with ID ${employee.employee_id} not found`)

		// Проверка должности и отдела
		if (updateEmployeeDto.department && updateEmployeeDto.position) {
			const allowedPositions = departmentPositionMap[updateEmployeeDto.department]
			if (!allowedPositions || !allowedPositions.includes(updateEmployeeDto.position)) {
				throw new InvalidPositionException(updateEmployeeDto.position, updateEmployeeDto.department)
			}
		}

		Object.assign(employee, updateEmployeeDto)
		const updatedEmployee = await this.employeeRepository.save(employee)

		return plainToInstance(EmployeeDto, updatedEmployee, { excludeExtraneousValues: true })
	}

	async findOne(name: string): Promise<Employee | null> {
		return await this.employeeRepository.findOne({ where: { name } })
	}

	// eslint-disable-next-line max-len
	async findEmployeeById(employee_id: number, relations: string[] = []): Promise<Employee | null> {
		if (!employee_id) {
			console.error('findEmployeeById called with undefined ID!')
			return null
		}

		// Загружаем сотрудника и связанные сущности (если указаны)
		const employee = await this.employeeRepository.findOne({
			where: { employee_id },
			relations: relations // добавляем параметр relations
		})

		// console.log('Found employee by ID:', employee)
		return employee
	}

	async findNameById(employee_id: number): Promise<string | null> {
		const employee = await this.employeeRepository.findOne({
			where: { employee_id },
			select: ['name'] // Запрашиваем только поле name
		})

		throwIfNotFound(employee, `Employee with ID ${employee_id} not found`)
		return employee.name
	}

	// метод для получения статистики сотрудника по ID
	async findEmployeeStatisticById(employee_id: number) {
		return this.statisticRepository.findOne({ where: { employee: { employee_id } } })
	}

	// Vtnjl lkz dsdjlf dct[ cjnhelybrjd]
	async getAllEmployees(): Promise<EmployeeDto[]> {
		const employees = await this.employeeRepository.find()

		return plainToInstance(EmployeeDto, employees, {
			excludeExtraneousValues: true
		})
	}

	async getProjectManagers(): Promise<EmployeeDto[]> {
		const managers = await this.employeeRepository.find({
			where: { position: Position.PROJECT_MANAGER }
		})
		return plainToInstance(EmployeeDto, managers, { excludeExtraneousValues: true })
	}

	async getProjectEmployees(projectId: number): Promise<EmployeeDto[]> {
		const employees = await this.employeeRepository.find({
			relations: ['projects'],
			where: { projects: { project_id: projectId } } // Условие фильтрации по проекту
		})
		return plainToInstance(EmployeeDto, employees, { excludeExtraneousValues: true })
	}

	async updateHourlyRate(employee_id: number, hourlyRate: number) {
		const employee = await this.employeeRepository.findOne({ where: { employee_id } })
		throwIfNotFound(employee, `Employee with ID ${employee_id} not found`)

		employee.hourlyRate = hourlyRate
		return this.employeeRepository.save(employee)
	}

	async getHourlyRate(employee_id: number): Promise<number> {
		const employee = await this.employeeRepository.findOne({
			where: { employee_id },
			select: ['hourlyRate']
		})
		throwIfNotFound(employee, `Employee with ID ${employee_id} not found`)
		return employee.hourlyRate
	}
}
