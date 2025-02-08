import { PartialType } from '@nestjs/mapped-types';
import { CreateAccessDto } from './create-access.dto';

export class UpdateAccessDto extends PartialType(CreateAccessDto) {}
