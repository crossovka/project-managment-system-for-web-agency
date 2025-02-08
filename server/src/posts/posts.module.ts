import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { PostsService } from './posts.service'
import { PostsController } from './posts.controller'

import { Post } from './entities/posts.entity'
import { Employee } from 'src/employee/entities/employee.entity'
import { Category } from 'src/categories/entities/categories.entity'

@Module({
	imports: [TypeOrmModule.forFeature([Post, Employee, Category])],
	controllers: [PostsController],
	providers: [PostsService]
})
export class PostsModule {}
