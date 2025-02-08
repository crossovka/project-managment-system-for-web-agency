/* eslint-disable indent */
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm'
import { Project } from 'src/projects/entities/project.entity'
import { IsNotEmpty, IsString } from 'class-validator'

/**
 * Сущность для доступа к ресурсам проекта.
 */
@Entity('access')
export class Access {
	@PrimaryGeneratedColumn()
	access_id: number

	/** Название ресурса */
	@Column({ length: 100 })
	@IsNotEmpty()
	@IsString()
	resourceName: string

	/** Логин для доступа */
	@Column({ length: 50 })
	@IsNotEmpty()
	@IsString()
	login: string

	/** Пароль для доступа */
	@Column({ length: 200 })
	@IsNotEmpty()
	@IsString()
	password: string

	/** Связь с проектом */
	@ManyToOne(() => Project, (project) => project.access, { lazy: false, nullable: false })
	project: Project
}
