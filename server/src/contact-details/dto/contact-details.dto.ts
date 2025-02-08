/* eslint-disable indent */
import { Expose } from 'class-transformer'
import { IsNotEmpty, IsString } from 'class-validator'

export class ContactDetailsDto {
	@Expose()
	@IsNotEmpty()
	@IsString()
	contactPerson: string

	@Expose()
	@IsNotEmpty()
	@IsString()
	contactInfo: string
}
