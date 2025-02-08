/* eslint-disable indent */
import { IsNotEmpty, IsNumber, IsString } from 'class-validator'

export class CreateContactDetailsDto {
	@IsNotEmpty()
	@IsString()
	contactPerson: string

	@IsNotEmpty()
	@IsString()
	contactInfo: string

	@IsNumber()
	client_id: number
}
