/* eslint-disable indent */
import { Expose } from 'class-transformer'
import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator'

export class CategoryDto {
	/** Name of the category */
	@Expose()
	@IsNotEmpty()
	@IsString()
	@Length(1, 100)
	name: string

	/** Description of the category */
	@Expose()
	@IsOptional()
	@IsString()
	description?: string
}
