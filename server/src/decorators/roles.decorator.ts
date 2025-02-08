import { SetMetadata } from '@nestjs/common'
import { Position } from 'src/types/types'

export const Roles = (...roles: Position[]) => SetMetadata('role', roles)
