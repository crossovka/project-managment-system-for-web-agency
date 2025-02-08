/* eslint-disable indent */
import { Expose, Type } from 'class-transformer'
import { IsArray, IsDate, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator'

import { AccessDto } from 'src/access/dto/access.dto'
import { ClientMinimalDto } from 'src/clients/dto/client-minimal.dto'
import { EmployeeDto } from 'src/employee/dto/Employee.dto'
import { TaskDto } from 'src/tasks/dto/task.dto'
import { ProjectStatus } from 'src/types/types'

export class ProjectDto {
	@Expose()
	project_id: number

	@IsString()
	@Expose()
	name: string

	@IsDate()
	@Expose()
	startDate: Date

	@IsDate()
	@IsOptional()
	@Expose()
	endDate?: Date

	@Expose()
	@IsNumber()
	totalTurnover: number

	@Expose()
	@IsNumber()
	accountsReceivable: number

	@Expose()
	@IsEnum(ProjectStatus)
	status: ProjectStatus

	@Expose()
	@Type(() => ClientMinimalDto)
	client: ClientMinimalDto

	@Expose()
	@Type(() => EmployeeDto)
	projectManager: EmployeeDto

	@IsArray()
	@Expose()
	@Type(() => EmployeeDto)
	employees: EmployeeDto[]

	@IsArray()
	@Expose()
	@Type(() => AccessDto)
	access: AccessDto[]

	@Expose()
	@IsOptional()
	@IsString()
	description: string

	@Expose()
	@IsOptional()
	@IsString()
	importantInfo: string

	// @Expose()
	// @IsNumber()
	// uncompletedTasksCount: number

	@IsArray()
	@Expose()
	@Type(() => TaskDto)
	tasks: TaskDto[]
}
