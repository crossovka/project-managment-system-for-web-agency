import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common'
import { EmployeeStatisticService } from './employee-statistic.service'
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard'
import { RolesGuard } from 'src/auth/guards/roles.guard'
import { Roles } from 'src/decorators/roles.decorator'
import { Position } from 'src/types/types'
// import { CreateEmployeeStatisticDto } from './dto/create-employee-statistic.dto'
// import { UpdateEmployeeStatisticDto } from './dto/update-employee-statistic.dto'

@Controller('employee-statistic')
export class EmployeeStatisticController {
	constructor(private readonly employeeStatisticService: EmployeeStatisticService) {}

	// Эндпоинт для обработки оплаты сотрудника
	@Post(':employeeId')
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(Position.DIRECTOR)
	async processPayment(
		@Param('employeeId') employeeId: number,
		@Body('paymentAmount') paymentAmount: number // Ожидается сумма оплаты
	) {
		try {
			await this.employeeStatisticService.processPayment(employeeId, paymentAmount)
			return { message: 'Payment processed successfully' }
		} catch (error) {
			throw new Error(`Failed to process payment: ${error.message}`)
		}
	}
}
