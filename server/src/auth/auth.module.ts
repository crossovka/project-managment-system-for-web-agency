import { Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { EmployeeModule } from 'src/employee/employee.module'
import { PassportModule } from '@nestjs/passport'
import { LocalStrategy } from './strategies/local.strategy'
import { JwtStrategy } from './strategies/jwt.strategy'
import { JwtAuthGuard } from './guards/jwt-auth.guard'
import { JwtModule } from '@nestjs/jwt'
import { ConfigModule } from '@nestjs/config'

@Module({
	imports: [
		EmployeeModule,
		PassportModule,
		JwtModule.registerAsync({
			imports: [ConfigModule],
			useFactory: () => ({
				secret: process.env.JWT_SECRET || '',
				signOptions: {
					expiresIn: '1d'
				},
				inject: [ConfigModule]
			})
		})
	],
	controllers: [AuthController],
	providers: [AuthService, LocalStrategy, JwtStrategy, JwtAuthGuard]
})
export class AuthModule {}
