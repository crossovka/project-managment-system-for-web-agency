/* eslint-disable indent */
import { Expose, Type } from 'class-transformer'
import { IsEnum, IsNotEmpty, IsNumber, IsString, MaxLength } from 'class-validator'
import { ProjectMinimalWithStatusDto } from 'src/projects/dto/project-minimal-with-status.dto'
import { Department, Position } from 'src/types/types'

export class EmployeeWithProjectsDto {
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

	@Expose()
	@IsNotEmpty()
	@IsNumber()
	hourlyRate: number

	@Expose()
	@Type(() => ProjectMinimalWithStatusDto)
	projects: ProjectMinimalWithStatusDto[]
}
