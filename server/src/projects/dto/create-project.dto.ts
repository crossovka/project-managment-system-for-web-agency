/* eslint-disable indent */
import { IsString, IsOptional, IsNumber, IsDate, IsArray, IsEnum } from 'class-validator'
import { Type } from 'class-transformer'
import { ProjectStatus } from 'src/types/types'

export class CreateProjectDto {
	@IsString()
	name: string

	@IsOptional()
	@IsString()
	description?: string

	@IsOptional()
	@IsString()
	importantInfo?: string

	@IsDate()
	@Type(() => Date)
	startDate: Date

	@IsOptional()
	@IsDate()
	@Type(() => Date)
	endDate?: Date

	@IsOptional()
	@IsNumber()
	totalTurnover?: number

	@IsOptional()
	@IsNumber()
	accountsReceivable?: number

	// Не обязательный статус для создания, т.к. он по умолчанию будет 'IN_PROGRESS'
	@IsEnum(ProjectStatus, { message: 'Invalid status' })
	status?: ProjectStatus

	@IsNumber()
	client_id: number

	@IsArray()
	@Type(() => Number)
	employees: number[]

	@IsNumber()
	project_manager_id: number
}
