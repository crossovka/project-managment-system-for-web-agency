import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { Task } from 'src/tasks/entities/task.entity'
import { EmployeeStatistic } from './entities/employee-statistic.entity'

import { TaskStatus } from 'src/types/types'
import { throwIfNotFound } from 'src/utils/common'

@Injectable()
export class EmployeeStatisticService {
	constructor(
		@InjectRepository(Task)
		private readonly taskRepository: Repository<Task>,

		@InjectRepository(EmployeeStatistic)
		private readonly employeeStatisticRepository: Repository<EmployeeStatistic>
	) {}

	async updateEmployeeStatistics(employeeId: number): Promise<void> {
		// Логирование начала работы
		console.log(`Updating statistics for employee with ID: ${employeeId}`)

		// Получаем все завершенные задачи сотрудника
		const completedTasks = await this.taskRepository.find({
			where: { assignedTo: { employee_id: employeeId }, status: TaskStatus.COMPLETED }
		})

		if (!completedTasks || completedTasks.length === 0) {
			console.log(`No completed tasks found for employee with ID: ${employeeId}`)
			return
		}

		// Подсчитываем доход и отработанные часы
		const totalEarnings = 0
		let pendingEarnings = 0 // Заработок "к получению"
		let monthlyEarnings = 0
		let hoursWorked = 0
		const currentMonth = new Date().getMonth()

		completedTasks.forEach((task) => {
			// Суммируем общий доход
			pendingEarnings += task.cost
			// Суммируем отработанные часы (минуты конвертируются в часы и округляются)
			hoursWorked += Math.round(task.hours + task.minutes / 60)

			// Определяем доход по месяцам (если задача выполнена в текущем месяце)
			if (task.dueDate && new Date(task.dueDate).getMonth() === currentMonth) {
				monthlyEarnings += task.cost
			}
		})

		// Логирование промежуточных результатов
		console.log(`Pending earnings: ${pendingEarnings}`)
		console.log(`Monthly earnings: ${monthlyEarnings}`)
		console.log(`Total earnings: ${totalEarnings}`)
		console.log(`Hours worked: ${hoursWorked}`)

		// Получаем статистику сотрудника
		const employeeStatistic = await this.employeeStatisticRepository.findOne({
			where: { employee: { employee_id: employeeId } },
			relations: ['employee']
		})

		if (employeeStatistic) {
			// Логируем, если статистика найдена
			console.log(`Found existing statistics for employee with ID: ${employeeId}`)

			// Обновляем статистику сотрудника
			employeeStatistic.pendingEarnings = pendingEarnings
			employeeStatistic.totalEarnings = totalEarnings
			employeeStatistic.pendingEarnings = pendingEarnings
			employeeStatistic.monthlyEarnings = monthlyEarnings
			employeeStatistic.hoursWorked = hoursWorked

			// Логируем обновление статистики
			console.log(`Updating statistics for employee with ID: ${employeeId}`)

			// Сохраняем обновленную статистику
			await this.employeeStatisticRepository.save(employeeStatistic)

			console.log(`Statistics updated successfully for employee with ID: ${employeeId}`)
		} else {
			// Логируем, если статистика не найдена
			console.log(`No existing statistics found for employee with ID: ${employeeId}`)
		}
	}

	async processPayment(employeeId: number, paymentAmount: number): Promise<void> {
		// Логируем начало обработки
		console.log(`Processing payment for employee with ID: ${employeeId}`)

		// Получаем статистику сотрудника
		const employeeStatistic = await this.employeeStatisticRepository.findOne({
			where: { employee: { employee_id: employeeId } },
			relations: ['employee']
		})

		// Проверяем, если статистика не найдена
		throwIfNotFound(employeeStatistic, `No statistics found for employee with ID: ${employeeId}`)

		// Проверяем корректность данных
		if (
			typeof employeeStatistic.pendingEarnings !== 'number' ||
			typeof employeeStatistic.totalEarnings !== 'number'
		) {
			throw new Error(
				`Invalid data for employee statistics. pendingEarnings: ${employeeStatistic.pendingEarnings}, totalEarnings: ${employeeStatistic.totalEarnings}`
			)
		}

		if (typeof paymentAmount !== 'number' || paymentAmount <= 0) {
			throw new Error(`Invalid payment amount: ${paymentAmount}`)
		}

		// Проверяем, есть ли достаточная сумма для оплаты
		if (employeeStatistic.pendingEarnings < paymentAmount) {
			console.log(`Insufficient pending earnings for employee with ID: ${employeeId}`)
			throw new Error(`Insufficient pending earnings for employee with ID: ${employeeId}`)
		}

		// Логируем промежуточный результат
		console.log(`Pending earnings before payment: ${employeeStatistic.pendingEarnings}`)

		// Вычитаем из "к получению" и добавляем в "оплачено"
		employeeStatistic.pendingEarnings -= paymentAmount
		employeeStatistic.totalEarnings += paymentAmount

		// Логируем обновление
		console.log(
			`Payment processed. Pending earnings: ${employeeStatistic.pendingEarnings}, Paid earnings: ${employeeStatistic.totalEarnings}`
		)

		// Сохраняем обновленную статистику
		await this.employeeStatisticRepository.save(employeeStatistic)

		console.log(`Payment successfully processed for employee with ID: ${employeeId}`)
	}
}
