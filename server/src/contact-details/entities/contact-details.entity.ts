/* eslint-disable indent */

import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm'
import { IsString, IsNotEmpty } from 'class-validator'
import { Expose } from 'class-transformer'
import { Client } from 'src/clients/entities/client.entity'

@Entity('contact_details')
export class ContactDetails {
	@PrimaryGeneratedColumn()
	@Expose()
	id: number

	@Column({ length: 100, nullable: false })
	@IsNotEmpty()
	@IsString()
	@Expose()
	contactPerson: string

	@Column({ length: 150, nullable: false })
	@IsNotEmpty()
	@IsString()
	@Expose()
	contactInfo: string

	@ManyToOne(() => Client, (client) => client.contactDetails, { onDelete: 'CASCADE' })
	client: Client
}
