/* eslint-disable indent */
import {
	Entity,
	Column,
	PrimaryGeneratedColumn,
	OneToMany,
	OneToOne,
	ManyToMany,
	JoinColumn,
	CreateDateColumn,
	UpdateDateColumn
} from 'typeorm'
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Length } from 'class-validator'
import { Exclude } from 'class-transformer'

import { Project } from 'src/projects/entities/project.entity'
import { Task } from 'src/tasks/entities/task.entity'
import { EmployeeStatistic } from 'src/employee-statistic/entities/employee-statistic.entity'
import { Post } from 'src/posts/entities/posts.entity'

import { Position, Department } from 'src/types/types'

/**
 * Сущность для сотрудников.
 */
@Entity('employees')
export class Employee {
	@PrimaryGeneratedColumn()
	employee_id: number

	/** Имя сотрудника */
	@Column({ length: 100 })
	@IsNotEmpty()
	@IsString()
	@Length(1, 100)
	name: string

	/** Пароль сотрудника (скрыто при сериализации) */
	@Exclude()
	@Column({ type: 'varchar', length: 255, nullable: false })
	@IsNotEmpty()
	@IsString()
	password: string

	/** Должность сотрудника */
	@Column({
		type: 'enum',
		enum: Position,
		enumName: 'Position',
		nullable: true
	})
	@IsOptional()
	@IsEnum(Position)
	position: Position

	/** Отдел сотрудника */
	@Column({
		type: 'enum',
		enum: Department,
		enumName: 'Department',
		nullable: true
	})
	@IsOptional()
	@IsEnum(Department)
	department: Department

	/** Проекты, в которых участвует сотрудник */
	@ManyToMany(() => Project, (project) => project.employees, { lazy: false })
	projects: Project[]

	/** Созданные задачи */
	@OneToMany(() => Task, (task) => task.createdBy, { lazy: false })
	createdTasks: Task[]

	/** Задачи, назначенные сотруднику */
	@OneToMany(() => Task, (task) => task.assignedTo, { lazy: false })
	tasks: Task[]

	/** Статистика сотрудника */
	@OneToOne(() => EmployeeStatistic, (statistic) => statistic.employee, { cascade: true })
	@JoinColumn({ name: 'statistic_id' })
	statistic: EmployeeStatistic

	@OneToMany(() => Post, (post) => post.createdBy, { cascade: true })
	createdPosts: Post[]

	@Column({ type: 'int', nullable: true })
	@IsNumber()
	hourlyRate: number

	/** Временные метки */
	@CreateDateColumn()
	createdAt: Date

	@UpdateDateColumn()
	updatedAt: Date
}
