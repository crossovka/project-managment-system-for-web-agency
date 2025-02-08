import { Strategy } from 'passport-local'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { AuthService } from '../auth.service'

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
	constructor(private authService: AuthService) {
		super({
			usernameField: 'name', // Указываем, что вместо username будет использоваться name
			passwordField: 'password',
			passReqToCallback: true // Позволяет передать req в callback
		})
	}

	async validate(req: Request, name: string, password: string): Promise<any> {
		const employee = await this.authService.validateEmployee(name, password)
		if (!employee) {
			throw new UnauthorizedException()
		}
		req['employee'] = employee // Сохраняем в req.employee вместо req.user по умолчанию Passport
		return employee
	}
}

// Этот файл нужен для реализации аутентификации пользователей с помощью стратегии "passport-local" в приложении, построенном на NestJS.

// "Passport-local" - это стратегия аутентификации, которая позволяет пользователю авторизоваться с помощью имени пользователя и пароля. Этот файл реализует логику аутентификации, используя сервис аутентификации (`AuthService`).

// Вот что делает этот файл:

// 1. Импортирует необходимые модули, включая `Strategy` из `passport-local` и `PassportStrategy` из `@nestjs/passport`.
// 2. Определяет класс `LocalStrategy`, который наследует от `PassportStrategy`.
// 3. В конструкторе класса передается экземпляр сервиса аутентификации (`AuthService`).
// 4. Метод `validate` вызывается при попытке аутентификации пользователя. Он принимает имя пользователя и пароль в качестве параметров.
// 5. Метод вызывает метод `validateEmployee` сервиса аутентификации, передавая имя пользователя и пароль. Если метод возвращает `null`, то пользователь не найден, и метод бросает исключение `UnauthorizedException`.
// 6. Если пользователь найден, метод возвращает объект пользователя.

// В общем, этот файл необходим для реализации аутентификации пользователей в приложении, построенном на NestJS, с помощью стратегии "passport-local".
