import { PartialType } from '@nestjs/mapped-types';
import { CreateEmployeeStatisticDto } from './create-employee-statistic.dto';

export class UpdateEmployeeStatisticDto extends PartialType(CreateEmployeeStatisticDto) {}
