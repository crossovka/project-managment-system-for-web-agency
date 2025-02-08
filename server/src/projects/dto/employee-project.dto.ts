/* eslint-disable indent */
import { Expose } from 'class-transformer'

export class EmployeeProjectDto {
	@Expose()
	project_id: number

	@Expose()
	name: string
}
