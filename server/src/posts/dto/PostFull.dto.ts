/* eslint-disable indent */
import { Expose, Type } from 'class-transformer'
import { IsString, IsNotEmpty } from 'class-validator'
import { CategoryDto } from 'src/categories/dto/Category.do'
import { EmployeeDto } from 'src/employee/dto/Employee.dto'

export class PostFullDto {
	@Expose()
	@IsNotEmpty()
	post_id: number

	@Expose()
	@IsString()
	@IsNotEmpty()
	title: string

	@Expose()
	@IsString()
	@IsNotEmpty()
	content: string

	@Expose()
	@Type(() => CategoryDto)
	category: CategoryDto

	@Expose()
	@Type(() => EmployeeDto)
	createdBy: EmployeeDto

	@Expose()
	createdAt: Date
	@Expose()
	updatedAt: Date
}
