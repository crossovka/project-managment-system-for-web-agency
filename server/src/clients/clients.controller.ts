import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common'

import { ClientsService } from './clients.service'
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard'
import { RolesGuard } from 'src/auth/guards/roles.guard'
import { Roles } from 'src/decorators/roles.decorator'

import { CreateClientDto } from './dto/create-client.dto'
import { UpdateClientDto } from './dto/update-client.dto'
import { ClientMinimalDto } from './dto/client-minimal.dto'
import { ClientDto } from './dto/client.dto'
import { Position } from 'src/types/types'

@Controller('clients')
export class ClientsController {
	constructor(private readonly clientsService: ClientsService) {}

	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(Position.DIRECTOR)
	@Post()
	async create(@Body() createClientDto: CreateClientDto) {
		return await this.clientsService.create(createClientDto)
	}

	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(Position.PROJECT_MANAGER, Position.DIRECTOR)
	@Get()
	async findAll(): Promise<ClientMinimalDto[]> {
		return this.clientsService.findAll()
	}

	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(Position.PROJECT_MANAGER, Position.DIRECTOR)
	@Get(':id')
	findOne(@Param('id') id: string): Promise<ClientDto> {
		return this.clientsService.findOne(+id)
	}

	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(Position.DIRECTOR)
	@Delete(':id')
	async remove(@Param('id') id: number) {
		return await this.clientsService.remove(id)
	}

	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(Position.DIRECTOR)
	@Patch(':id')
	async update(@Param('id') id: number, @Body() updateClientDto: UpdateClientDto) {
		return await this.clientsService.update(id, updateClientDto)
	}
}
