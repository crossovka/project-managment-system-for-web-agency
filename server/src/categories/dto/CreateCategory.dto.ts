/* eslint-disable indent */
import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator'

export class CreateCategoryDto {
	/** Name of the category */
	@IsNotEmpty()
	@IsString()
	@Length(1, 100)
	name: string

	/** Description of the category */
	@IsOptional()
	@IsString()
	description?: string
}
