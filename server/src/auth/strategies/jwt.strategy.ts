import { ExtractJwt, Strategy } from 'passport-jwt'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { EmployeeService } from 'src/employee/employee.service'
import { EmployeeMinimalDto } from 'src/employee/dto/employee-minimal.dto'
import { throwIfNotFound } from 'src/utils/common'
import { Position } from 'src/types/types'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(
		private readonly configService: ConfigService,
		private readonly employeeService: EmployeeService
	) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: configService.get('JWT_SECRET')
		})
	}

	async validate(payload: EmployeeMinimalDto): Promise<any> {
		const employee = await this.employeeService.findEmployeeById(payload.employee_id)
		throwIfNotFound(employee, 'Employee not found')

		return {
			employee_id: employee.employee_id,
			name: employee.name,
			position: employee.position
		}
	}
}
