import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Employee } from './entities/employee.entity'
import { EmployeeService } from './employee.service'
import { EmployeeController } from './employee.controller'
import { EmployeeStatistic } from 'src/employee-statistic/entities/employee-statistic.entity'

@Module({
	imports: [TypeOrmModule.forFeature([Employee, EmployeeStatistic])],
	providers: [EmployeeService],
	controllers: [EmployeeController],
	exports: [EmployeeService]
})
export class EmployeeModule {}
