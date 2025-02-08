/* eslint-disable indent */
import { Expose } from 'class-transformer'
import { IsEnum } from 'class-validator'
import { ProjectStatus } from 'src/types/types'

export class ProjectMinimalWithStatusDto {
	@Expose()
	project_id: number

	@Expose()
	name: string

	@Expose()
	@IsEnum(ProjectStatus)
	status: ProjectStatus
}
