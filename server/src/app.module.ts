import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'

import { TasksModule } from './tasks/tasks.module'
import { AuthModule } from './auth/auth.module'
import { EmployeeModule } from './employee/employee.module'
import { ClientsModule } from './clients/clients.module'
// import { ReportsModule } from './reports/reports.module'
import { AccessModule } from './access/access.module'
import { ProjectsModule } from './projects/projects.module'
import { EmployeeStatisticModule } from './employee-statistic/employee-statistic.module'
import { ContactDetailsModule } from './contact-details/contact-details.module'
import { CategoriesModule } from './categories/categories.module';
import { PostsModule } from './posts/posts.module';

@Module({
	imports: [
		ConfigModule.forRoot({ isGlobal: true }),
		TypeOrmModule.forRootAsync({
			imports: [ConfigModule],
			useFactory: (configService: ConfigService) => ({
				type: 'postgres',
				host: configService.get('DB_HOST'),
				port: configService.get('DB_PORT'),
				username: configService.get('DB_USERNAME'),
				password: configService.get('DB_PASSWORD'),
				database: configService.get('DB_NAME'),
				entities: [__dirname + '/**/*.entity{.ts,.js}'],
				migrations: [__dirname + '/migrations/*.{js,ts}'], // Папка с миграциями
				migrationsRun: true, // Автоматически запускать миграции при старте
				logging: false,
				synchronize: true // Отключите в продакшене! / если миграции определяют структуру
			}),
			inject: [ConfigService]
		}),
		TasksModule,
		AuthModule,
		EmployeeModule,
		ClientsModule,
		// ReportsModule,
		EmployeeStatisticModule,
		ProjectsModule,
		AccessModule,
		ContactDetailsModule,
		CategoriesModule,
		PostsModule
	],
	controllers: [AppController],
	providers: [AppService]
})
export class AppModule {}
