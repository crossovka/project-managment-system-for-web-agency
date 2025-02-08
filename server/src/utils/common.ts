import { BadRequestException, NotFoundException } from '@nestjs/common'

/**
 * Throws a {@link NotFoundException} if the provided entity is not found.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function throwIfNotFound(entity: any, message: string): void {
	if (!entity) {
		throw new NotFoundException(message)
	}
}

/**
 * Throws a {@link BadRequestException} if the provided entity exists.
 */
export function throwIfDuplicate(entity: any, message: string): asserts entity {
	if (entity) {
		throw new BadRequestException(message)
	}
}