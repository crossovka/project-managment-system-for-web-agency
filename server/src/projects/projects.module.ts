import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ProjectsService } from './projects.service'
import { ProjectsController } from './projects.controller'
import { Project } from './entities/project.entity'
import { Employee } from 'src/employee/entities/employee.entity'
import { Client } from 'src/clients/entities/client.entity'

@Module({
	imports: [TypeOrmModule.forFeature([Project, Employee, Client])],
	controllers: [ProjectsController],
	providers: [ProjectsService],
	exports: [ProjectsService]
})
export class ProjectsModule {}
