/* eslint-disable indent */
import { Exclude, Expose, Type } from 'class-transformer'

export class EmployeeStatisticDto {
	@Expose()
	statistic_id: number

	@Expose()
	totalEarnings: number

	@Expose()
	pendingEarnings: number

	@Expose()
	monthlyEarnings: number

	@Expose()
	hoursWorked: number

	// Исключаем сам объект employee из сериализованного результата
	@Expose()
	@Type(() => Number) // Возвращаем только ID сотрудника
	employee_id: number

	// Исключаем поле employee для сериализации
	@Exclude()
	employee: any // Ожидаем, что это будет объект или id сотрудника
}
