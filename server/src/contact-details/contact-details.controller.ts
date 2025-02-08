import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common'
import { ContactDetailsService } from './contact-details.service'

import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard'
import { RolesGuard } from 'src/auth/guards/roles.guard'
import { Roles } from 'src/decorators/roles.decorator'

import { CreateContactDetailsDto } from './dto/create-contact-details.dto'
import { UpdateContactDetailsDto } from './dto/update-contact-details.dto'
import { Position } from 'src/types/types'

@Controller('contact-details')
export class ContactDetailsController {
	constructor(private readonly contactDetailsService: ContactDetailsService) {}

	@Post()
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(Position.PROJECT_MANAGER, Position.DIRECTOR)
	create(@Body() createContactDetailsDto: CreateContactDetailsDto) {
		return this.contactDetailsService.create(createContactDetailsDto)
	}

	@Get()
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(Position.PROJECT_MANAGER, Position.DIRECTOR)
	findAll() {
		return this.contactDetailsService.findAll()
	}

	@Get(':id')
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(Position.PROJECT_MANAGER, Position.DIRECTOR)
	findOne(@Param('id') id: number) {
		return this.contactDetailsService.findOne(id)
	}

	@Patch(':id')
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(Position.PROJECT_MANAGER, Position.DIRECTOR)
	update(@Param('id') id: number, @Body() updateContactDetailsDto: UpdateContactDetailsDto) {
		return this.contactDetailsService.update(id, updateContactDetailsDto)
	}

	@Delete(':id')
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(Position.PROJECT_MANAGER, Position.DIRECTOR)
	remove(@Param('id') id: number) {
		return this.contactDetailsService.remove(id)
	}
}
