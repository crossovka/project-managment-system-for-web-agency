/* eslint-disable indent */
import {
	Entity,
	Column,
	PrimaryGeneratedColumn,
	ManyToOne,
	JoinColumn,
	CreateDateColumn,
	UpdateDateColumn
} from 'typeorm'
import { IsEnum, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator'

import { Project } from 'src/projects/entities/project.entity'
import { Employee } from 'src/employee/entities/employee.entity'

import { TaskStatus, WorkType } from 'src/types/types'

/**
 * Сущность для задач.
 */
@Entity('tasks')
export class Task {
	@PrimaryGeneratedColumn()
	task_id: number

	/** Название задачи */
	@Column({ length: 500, nullable: true })
	@IsOptional()
	@IsString()
	title?: string

	/** Описание задачи */
	@Column({ type: 'text', nullable: true })
	@IsOptional()
	@IsString()
	description?: string

	/** Дата начала выполнения задачи */
	@Column({ type: 'date', nullable: true })
	startDate?: Date

	/** Дата завершения задачи */
	@Column({ type: 'date', nullable: true })
	dueDate?: Date

	/** Связь с проектом */
	@ManyToOne(() => Project, (project) => project.tasks, { lazy: false, onDelete: 'CASCADE' })
	@JoinColumn({ name: 'project_id' }) // Убедись, что указано правильное имя поля
	project: Project

	/** Создатель задачи */
	@ManyToOne(() => Employee, (employee) => employee.createdTasks, { nullable: false })
	@JoinColumn({ name: 'created_by' })
	createdBy: Employee

	/** Исполнитель задачи */
	@ManyToOne(() => Employee, (employee) => employee.tasks, { nullable: false })
	@JoinColumn({ name: 'assigned_to' })
	assignedTo: Employee

	/** Статус задачи */
	@Column({
		type: 'enum',
		enum: TaskStatus,
		enumName: 'TaskStatus',
		nullable: true
	})
	@IsOptional()
	@IsEnum(TaskStatus)
	status?: TaskStatus

	/** Тип работы */
	@Column({
		type: 'enum',
		enum: WorkType,
		enumName: 'WorkType',
		nullable: true
	})
	@IsOptional()
	@IsEnum(WorkType)
	workType?: WorkType

	@Column({ type: 'integer', nullable: true, default: 0 })
	@IsOptional()
	@IsNumber()
	@Min(0)
	hours?: number

	@Column({ type: 'integer', nullable: true, default: 0 })
	@IsOptional()
	@IsNumber()
	@Min(0)
	@Max(59)
	minutes?: number

	/** Стоимость задачи */
	@Column({ type: 'int', default: 0 })
	@IsNumber()
	cost: number

	/** Флаг, указывающий, была ли задача учтена при обновлении оборота проекта */
	@Column({ type: 'boolean', default: false })
	turnedOver: boolean

	/** Временные метки */
	@CreateDateColumn()
	createdAt: Date

	@UpdateDateColumn()
	updatedAt: Date
}
