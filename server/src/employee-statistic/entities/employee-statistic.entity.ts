/* eslint-disable indent */
import {
	Entity,
	Column,
	PrimaryGeneratedColumn,
	OneToOne,
	JoinColumn,
	CreateDateColumn,
	UpdateDateColumn
} from 'typeorm'
import { IsInt, IsOptional, Min } from 'class-validator'
import { Employee } from 'src/employee/entities/employee.entity'

/**
 * Сущность для статистики сотрудников.
 */
@Entity('employee_statistics')
export class EmployeeStatistic {
	@PrimaryGeneratedColumn()
	statistic_id: number

	/** Связь с сотрудником у одного сотрудника может быть только одна статистика */
	@OneToOne(() => Employee, (employee) => employee.statistic, { cascade: false })
	@JoinColumn({ name: 'employee_id' })
	employee: Employee

	/** Общий доход сотрудника */
	@Column({ type: 'integer', default: 0 })
	@IsOptional()
	@IsInt()
	@Min(0)
	totalEarnings?: number

	/** Ожидаемый доход */
	@Column({ type: 'integer', default: 0 })
	@IsOptional()
	@IsInt()
	@Min(0)
	pendingEarnings?: number

	/** Доход за месяц */
	@Column({ type: 'integer', default: 0 })
	@IsOptional()
	@IsInt()
	@Min(0)
	monthlyEarnings?: number

	/** Отработанные часы */
	@Column({ type: 'integer', default: 0 })
	@IsOptional()
	@IsInt()
	@Min(0)
	hoursWorked?: number

	/** Временные метки */
	@CreateDateColumn()
	createdAt: Date

	@UpdateDateColumn()
	updatedAt: Date
}
