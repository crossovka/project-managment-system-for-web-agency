import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common'
import { AccessService } from './access.service'
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard'
import { CreateAccessDto } from './dto/create-access.dto'
import { UpdateAccessDto } from './dto/update-access.dto'

@Controller('access')
export class AccessController {
	constructor(private readonly accessService: AccessService) {}

	@Post()
	@UseGuards(JwtAuthGuard)
	async create(@Body() createAccessDto: CreateAccessDto) {
		return await this.accessService.create(createAccessDto)
	}

	@Get()
	@UseGuards(JwtAuthGuard)
	async findAll() {
		return await this.accessService.findAll()
	}

	@Get(':id')
	@UseGuards(JwtAuthGuard)
	async findOne(@Param('id') id: string) {
		return await this.accessService.findOne(+id)
	}

	@Patch(':id')
	@UseGuards(JwtAuthGuard)
	async update(@Param('id') id: string, @Body() updateAccessDto: UpdateAccessDto) {
		return await this.accessService.update(+id, updateAccessDto)
	}

	@Delete(':id')
	@UseGuards(JwtAuthGuard)
	async remove(@Param('id') id: string) {
		return await this.accessService.remove(+id)
	}
}
