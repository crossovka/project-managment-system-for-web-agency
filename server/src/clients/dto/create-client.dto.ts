/* eslint-disable indent */
import { Type } from 'class-transformer'
import { IsNotEmpty, IsOptional, IsString, Length, ValidateNested } from 'class-validator'
import { CreateContactDetailsDto } from 'src/contact-details/dto/create-contact-details.dto'

export class CreateClientDto {
	@IsNotEmpty()
	@IsString()
	@Length(1, 150)
	companyName: string

	@IsOptional()
	@ValidateNested({ each: true })
	@Type(() => CreateContactDetailsDto)
	contactDetails?: CreateContactDetailsDto[]
}
