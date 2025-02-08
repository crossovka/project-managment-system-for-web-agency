/* eslint-disable indent */
import { Expose } from 'class-transformer'

export class EmployeeMinimalDto {
	@Expose()
	employee_id: number

	@Expose()
	name: string
}
