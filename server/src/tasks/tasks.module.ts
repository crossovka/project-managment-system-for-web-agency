import { Module } from '@nestjs/common'
import { TasksController } from './tasks.controller'
import { TypeOrmModule } from '@nestjs/typeorm'

import { Task } from './entities/task.entity'
import { Employee } from 'src/employee/entities/employee.entity'
import { Project } from 'src/projects/entities/project.entity'
import { Client } from 'src/clients/entities/client.entity'

import { TaskStatusGuard } from './guards/task-status.guard'

import { TasksService } from './tasks.service'
import { ProjectsService } from 'src/projects/projects.service'
import { EmployeeStatisticService } from 'src/employee-statistic/employee-statistic.service'
import { EmployeeStatistic } from 'src/employee-statistic/entities/employee-statistic.entity'

@Module({
	imports: [TypeOrmModule.forFeature([Task, Employee, Project, Client, EmployeeStatistic])],
	controllers: [TasksController],
	providers: [TasksService, TaskStatusGuard, ProjectsService, EmployeeStatisticService],
	exports: [TasksService]
})
export class TasksModule {}
