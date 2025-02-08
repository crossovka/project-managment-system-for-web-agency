import { DataSource } from 'typeorm'

import { Access } from './access/entities/access.entity'
import { Client } from './clients/entities/client.entity'
import { Employee } from './employee/entities/employee.entity'
import { EmployeeStatistic } from './employee-statistic/entities/employee-statistic.entity'
import { Project } from './projects/entities/project.entity'
// import { Report } from './reports/entities/report.entity'
import { Task } from './tasks/entities/task.entity'
import * as dotenv from 'dotenv'
dotenv.config()

export const AppDataSource = new DataSource({
	type: 'postgres',
	host: process.env.DB_HOST,
	port: parseInt(process.env.DB_PORT, 10),
	username: process.env.DB_USERNAME,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_NAME,
	entities: [
		Access,
		Client,
		Employee,
		EmployeeStatistic,
		Project,
		// Report,
		Task
	],
	migrations: [__dirname + '/src/migrations/*.{ts,js}'], // путь к миграциям
	synchronize: false, // Не рекомендуется использовать в продакшн
	logging: true
})
