/* eslint-disable indent */
import { IsString, IsNotEmpty, MaxLength, MinLength, IsEnum, IsNumber } from 'class-validator'
import { Position, Department } from 'src/types/types'

export class CreateEmployeeDto {
	@IsNotEmpty()
	@IsString()
	@MaxLength(100)
	name: string

	@IsNotEmpty()
	@IsEnum(Position)
	position: Position

	@IsNotEmpty()
	@IsEnum(Department)
	department: Department

	@MinLength(6, { message: 'Пароль должен состоять минимум из 6 символов' })
	password: string

	@IsNotEmpty()
	@IsNumber()
	hourlyRate?: number
}
