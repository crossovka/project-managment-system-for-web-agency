/* eslint-disable indent */
import { Expose, Type } from 'class-transformer'
import { IsInt, IsNotEmpty, IsString, Length } from 'class-validator'
import { ProjectMinimalDto } from 'src/projects/dto/project-minimal.dto'

export class AccessDto {
	@Expose()
	@IsInt()
	access_id: number

	@Expose()
	@IsNotEmpty()
	@IsString()
	@Length(3, 100)
	resourceName: string

	@Expose()
	@IsNotEmpty()
	@IsString()
	@Length(6, 200)
	login: string

	@Expose()
	@IsNotEmpty()
	@IsString()
	@Length(6, 200)
	password: string

	@Expose()
	@Type(() => ProjectMinimalDto)
	project?: ProjectMinimalDto
}
