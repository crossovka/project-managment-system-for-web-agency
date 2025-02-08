/* eslint-disable indent */
import { Expose } from 'class-transformer'
import { IsEnum, IsNotEmpty, IsString, MaxLength } from 'class-validator'
import { Department, Position } from 'src/types/types'

export class EmployeeDto {
	@Expose()
	employee_id: number

	@Expose()
	@IsNotEmpty()
	@IsString()
	@MaxLength(100)
	name: string

	@Expose()
	@IsNotEmpty()
	@IsEnum(Position)
	position: Position

	@Expose()
	@IsNotEmpty()
	@IsEnum(Department)
	department: Department

	// @Expose()
	// @Type(() => ProjectDto)
	// projects: ProjectDto[]

	// @Expose()
	// @Type(() => TaskDto)
	// createdTasks: TaskDto[]

	// @Expose()
	// @Type(() => TaskDto)
	// tasks: TaskDto[]

	// @Expose()
	// @Type(() => EmployeeStatisticDto)
	// statistic: EmployeeStatisticDto
}
