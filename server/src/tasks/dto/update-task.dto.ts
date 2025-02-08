/* eslint-disable indent */
import { IsInt, IsString, IsOptional, IsEnum, IsDate, IsNumber, Min, Max } from 'class-validator'
import { Expose, Type } from 'class-transformer'

import { EmployeeDto } from 'src/employee/dto/Employee.dto'
import { ProjectMinimalDto } from 'src/projects/dto/project-minimal.dto'

import { TaskStatus, WorkType } from 'src/types/types'

export class UpdateTaskDto {
	@Expose()
	@IsInt()
	task_id: number

	@Expose()
	@IsInt()
	project_id: number

	@Expose()
	@IsString()
	@IsOptional()
	title?: string

	@Expose()
	@IsString()
	@IsOptional()
	description?: string

	@Expose()
	@IsDate()
	@IsOptional()
	startDate?: Date

	@Expose()
	@IsDate()
	@IsOptional()
	dueDate?: Date

	@Expose()
	@IsEnum(TaskStatus)
	@IsOptional()
	status?: TaskStatus

	@Expose()
	@IsEnum(WorkType)
	@IsOptional()
	workType?: WorkType

	@Expose()
	@IsOptional()
	@IsNumber()
	@Min(0)
	hours?: number

	@Expose()
	@IsOptional()
	@IsNumber()
	@Min(0)
	@Max(59)
	minutes?: number

	@Expose()
	@IsNumber()
	@IsOptional()
	cost?: number

	@Expose()
	@Type(() => EmployeeDto)
	@IsOptional()
	assignedTo?: EmployeeDto

	@Expose()
	@Type(() => EmployeeDto)
	@IsOptional()
	createdBy?: EmployeeDto

	@Expose()
	@Type(() => ProjectMinimalDto)
	@IsOptional()
	project?: ProjectMinimalDto
}
