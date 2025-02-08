import {
	Body,
	Controller,
	Get,
	Param,
	Post,
	Put,
	UseGuards,
	UsePipes,
	ValidationPipe
} from '@nestjs/common'

import { EmployeeService } from './employee.service'
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard'
import { RolesGuard } from 'src/auth/guards/roles.guard'
import { Roles } from 'src/decorators/roles.decorator'

import { CreateEmployeeDto } from './dto/create-employee.dto'
import { UpdateEmployeeDto } from './dto/update-employee.dto'
import { Position } from 'src/types/types'

@Controller('employees')
export class EmployeeController {
	constructor(private readonly employeeService: EmployeeService) {}

	// @UseGuards(JwtAuthGuard, RolesGuard)
	// @Roles(Position.DIRECTOR)
	@Post()
	@UsePipes(new ValidationPipe())
	create(@Body() createEmployeeDto: CreateEmployeeDto) {
		return this.employeeService.create(createEmployeeDto)
	}

	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(Position.DIRECTOR)
	@Put(':employee_id')
	@UsePipes(new ValidationPipe())
	async update(
		@Param('employee_id') employee_id: number,
		@Body() updateEmployeeDto: UpdateEmployeeDto
	) {
		return this.employeeService.update(employee_id, updateEmployeeDto)
	}

	@UseGuards(JwtAuthGuard)
	@Get(':employee_id/name')
	async findNameById(@Param('employee_id') employee_id: number) {
		const name = await this.employeeService.findNameById(employee_id)
		return { name }
	}

	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(Position.DIRECTOR, Position.PROJECT_MANAGER)
	@Get()
	async getAllEmployees() {
		const employees = await this.employeeService.getAllEmployees()
		return { employees }
	}

	@UseGuards(JwtAuthGuard)
	@Get('managers')
	async getProjectManagers() {
		const employees = await this.employeeService.getProjectManagers()
		return { employees }
	}

	@UseGuards(JwtAuthGuard)
	@Get('projects/:projectId')
	async getProjectEmployees(@Param('projectId') projectId: number) {
		const employees = await this.employeeService.getProjectEmployees(projectId)
		return { employees }
	}

	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(Position.DIRECTOR)
	@Put(':employee_id/rate')
	@UsePipes(new ValidationPipe())
	async updateHourlyRate(
		@Param('employee_id') employee_id: number,
		@Body('hourlyRate') hourlyRate: number
	) {
		return this.employeeService.updateHourlyRate(employee_id, hourlyRate)
	}

	@UseGuards(JwtAuthGuard)
	@Get(':employee_id/hourly-rate')
	async getHourlyRate(@Param('employee_id') employee_id: number) {
		const rate = await this.employeeService.getHourlyRate(employee_id)
		return { hourlyRate: rate }
	}
}
