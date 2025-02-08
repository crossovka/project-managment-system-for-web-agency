/* eslint-disable indent */
import { Expose } from 'class-transformer'

export class ClientMinimalDto {
	@Expose()
	client_id: number

	@Expose()
	companyName: string
}
