import { PartialType } from '@nestjs/mapped-types'
import { CreateContactDetailsDto } from './create-contact-details.dto'

export class UpdateContactDetailsDto extends PartialType(CreateContactDetailsDto) {}
