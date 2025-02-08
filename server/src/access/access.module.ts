import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { AccessService } from './access.service'
import { AccessController } from './access.controller'

import { Access } from './entities/access.entity'
import { Project } from 'src/projects/entities/project.entity'

@Module({
	imports: [TypeOrmModule.forFeature([Access, Project])],
	controllers: [AccessController],
	providers: [AccessService]
})
export class AccessModule {}
