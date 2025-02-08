import { HttpException, HttpStatus } from '@nestjs/common'

export class InvalidPositionException extends HttpException {
	constructor(position: string, department: string) {
		super(
			{
				statusCode: HttpStatus.BAD_REQUEST,
				message: `Position "${position}" is not allowed in department "${department}".`
			},
			HttpStatus.BAD_REQUEST
		)
	}
}
