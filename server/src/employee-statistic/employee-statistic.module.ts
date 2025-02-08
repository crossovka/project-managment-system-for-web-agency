import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { EmployeeStatisticService } from './employee-statistic.service'
import { EmployeeStatisticController } from './employee-statistic.controller'

import { Task } from 'src/tasks/entities/task.entity'
import { EmployeeStatistic } from './entities/employee-statistic.entity'

@Module({
	imports: [TypeOrmModule.forFeature([Task, EmployeeStatistic])],
	controllers: [EmployeeStatisticController],
	providers: [EmployeeStatisticService]
})
export class EmployeeStatisticModule {}
