/* eslint-disable indent */
import { IsInt, IsNotEmpty, IsString, Length } from 'class-validator'

export class CreateAccessDto {
	@IsNotEmpty()
	@IsString()
	@Length(3, 100)
	resourceName: string

	@IsNotEmpty()
	@IsString()
	@Length(3, 50)
	login: string

	@IsNotEmpty()
	@IsString()
	@Length(6, 200)
	password: string

	@IsNotEmpty()
	@IsInt()
	projectId: number
}
