/* eslint-disable indent */
import { IsString, IsOptional, IsDate, IsNumber, IsInt, IsEnum, Min, Max } from 'class-validator'
import { TaskStatus, WorkType } from 'src/types/types'

export class CreateTaskDto {
	@IsString()
	title: string

	@IsString()
	description: string

	@IsDate()
	dueDate: Date

	@IsDate()
	startDate: Date

	@IsNumber()
	project_id: number

	@IsEnum(TaskStatus)
	status: TaskStatus

	@IsEnum(WorkType)
	workType: WorkType

	@IsOptional()
	@IsNumber()
	@Min(0)
	hours?: number

	@IsOptional()
	@IsNumber()
	@Min(0)
	@Max(59)
	minutes?: number

	@IsNumber()
	@IsOptional()
	cost: number

	@IsInt()
	assignedTo: number

	@IsInt()
	createdBy: number

	// @IsInt()
	// @Type(() => EmployeeDto)
	// assignedTo?: EmployeeDto

	// @Type(() => EmployeeDto)
	// @IsInt()
	// created_by: EmployeeDto
}
