/* eslint-disable indent */
import {
	Entity,
	Column,
	PrimaryGeneratedColumn,
	OneToMany,
	ManyToOne,
	ManyToMany,
	JoinTable,
	JoinColumn,
	CreateDateColumn,
	UpdateDateColumn,
	Index
} from 'typeorm'
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator'

import { Client } from 'src/clients/entities/client.entity'
import { Employee } from 'src/employee/entities/employee.entity'
import { Task } from 'src/tasks/entities/task.entity'
import { Access } from 'src/access/entities/access.entity'
import { ProjectStatus } from 'src/types/types'

/**
 * Сущность проекта.
 */
@Entity('projects')
export class Project {
	@PrimaryGeneratedColumn()
	project_id: number

	/** Название проекта */
	@Column({ length: 100 })
	@Index()
	@IsNotEmpty()
	@IsString()
	name: string

	/** Описание проекта */
	@Column({ type: 'text', nullable: true })
	@IsOptional()
	@IsString()
	description?: string

	/** Важная информация */
	@Column({ type: 'text', nullable: true })
	@IsOptional()
	@IsString()
	importantInfo?: string

	/** Дата начала проекта */
	@Column({ type: 'date' })
	startDate: Date

	/** Дата завершения проекта */
	@Column({ type: 'date', nullable: true })
	endDate?: Date

	/** Общий оборот */
	@Column({ type: 'int', nullable: true })
	@IsOptional()
	@IsNumber()
	totalTurnover: number

	/** Дебиторская задолженность */
	// @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
	@Column({ type: 'int', nullable: true })
	@IsOptional()
	@IsNumber()
	accountsReceivable: number

	/** Статус проекта */
	@Column({ type: 'enum', enum: ProjectStatus, default: ProjectStatus.IN_PROGRESS })
	status: ProjectStatus

	/** Связь с клиентом */
	@ManyToOne(() => Client, (client) => client.projects, { lazy: false })
	client: Client

	/** Связь с сотрудниками */
	@ManyToMany(() => Employee, (employee) => employee.projects, { lazy: false })
	// @JoinTable()
	@JoinTable({
		name: 'employee_projects'
		// joinColumns: [{ name: 'employee_id' }],
		// inverseJoinColumns: [{ name: 'project_id' }]
	})
	employees: Employee[]

	/** Менеджер проекта */
	@ManyToOne(() => Employee, { nullable: true, lazy: false })
	@JoinColumn({ name: 'project_manager_id' })
	projectManager: Employee

	/** Связь с задачами */
	@OneToMany(() => Task, (task) => task.project, { lazy: false, cascade: true })
	tasks: Task[]

	/** Связь с доступами */
	@OneToMany(() => Access, (access) => access.project, { lazy: false, cascade: true })
	access: Access[]

	/** Временные метки */
	@CreateDateColumn()
	createdAt: Date

	@UpdateDateColumn()
	updatedAt: Date
}
