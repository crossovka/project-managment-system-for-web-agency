/* eslint-disable indent */
import { Expose, Type } from 'class-transformer'
import { IsDate, IsEnum, IsInt, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator'

import { EmployeeDto } from 'src/employee/dto/Employee.dto'
import { ProjectMinimalDto } from 'src/projects/dto/project-minimal.dto'

import { TaskStatus, WorkType } from 'src/types/types'

export class TaskDto {
	@Expose()
	@IsInt()
	task_id: number

	@Expose()
	@IsString()
	title: string

	@Expose()
	@IsString()
	description: string

	@Expose()
	@IsDate()
	startDate: Date // Дата начала выполнения задачи

	@Expose()
	@IsDate()
	dueDate: Date // Дата завершения задачи

	@Expose()
	@Type(() => ProjectMinimalDto)
	project: ProjectMinimalDto

	@Expose()
	@IsEnum(TaskStatus)
	status: TaskStatus

	@Expose()
	@IsEnum(WorkType)
	workType: WorkType

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
	cost: number

	@Expose()
	@Type(() => EmployeeDto)
	assignedTo: EmployeeDto

	@Expose()
	@Type(() => EmployeeDto)
	createdBy: EmployeeDto
}
