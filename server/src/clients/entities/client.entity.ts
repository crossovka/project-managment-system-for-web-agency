/* eslint-disable indent */
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm'
import { IsNotEmpty, IsString } from 'class-validator'

import { Project } from 'src/projects/entities/project.entity'
import { ContactDetails } from 'src/contact-details/entities/contact-details.entity'

/**
 * Сущность клиента.
 */
@Entity('clients')
export class Client {
	@PrimaryGeneratedColumn()
	client_id: number

	/** Название компании */
	@Column({ length: 150, nullable: false })
	@IsNotEmpty()
	@IsString()
	companyName: string

	/** Контактное лицо */
	// @Column({ length: 100, nullable: false })
	// @IsOptional()
	// @IsString()S
	// contactPerson?: string

	/** Контактная информация */
	// @Column({ length: 150, nullable: false })
	// @IsOptional()
	// @IsString()
	// contactInfo?: string

	@OneToMany(() => ContactDetails, (contactDetails) => contactDetails.client, { cascade: true })
	contactDetails: ContactDetails[]

	/** Связь с проектами */
	@OneToMany(() => Project, (project) => project.client, { lazy: false })
	projects: Project[]
}
