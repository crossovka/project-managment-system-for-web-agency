import { NestFactory, Reflector } from '@nestjs/core'
import { AppModule } from './app.module'
// import { ClassSerializerInterceptor } from '@nestjs/common'

async function bootstrap() {
	const app = await NestFactory.create(AppModule)
	app.setGlobalPrefix('api')
	app.enableCors({
		origin: process.env.CLIENT_URL, // Указываем точный домен клиента
		methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
		credentials: true // Разрешаем использование cookies и заголовков авторизации
	})
	// // Включение глобального интерсептора
	// app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)))

	await app.listen(process.env.PORT ?? 3000)
}
bootstrap()
