/* eslint-disable indent */
import { Expose, Type } from 'class-transformer'
import { ProjectMinimalWithStatusDto } from 'src/projects/dto/project-minimal-with-status.dto'
import { ContactDetailsDto } from 'src/contact-details/dto/contact-details.dto'

export class ClientDto {
	@Expose()
	client_id: number

	@Expose()
	companyName: string

	@Expose()
	@Type(() => ContactDetailsDto)
	contactDetails: ContactDetailsDto[]

	@Expose()
	@Type(() => ProjectMinimalWithStatusDto)
	projects: ProjectMinimalWithStatusDto[]
}
