import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { throwIfDuplicate, throwIfNotFound } from 'src/utils/common'

import { Client } from './entities/client.entity'

import { CreateClientDto } from './dto/create-client.dto'
import { UpdateClientDto } from './dto/update-client.dto'
import { plainToClass } from 'class-transformer'
import { ClientMinimalDto } from './dto/client-minimal.dto'
import { ClientDto } from './dto/client.dto'

@Injectable()
export class ClientsService {
	constructor(@InjectRepository(Client) private readonly clientRepository: Repository<Client>) {}

	async create(createClientDto: CreateClientDto): Promise<Client> {
		const existingClient = await this.clientRepository.findOne({
			where: { companyName: createClientDto.companyName }
		})

		throwIfDuplicate(existingClient, 'Client with this company name already exists')

		const client = this.clientRepository.create({
			...createClientDto,
			contactDetails: createClientDto.contactDetails
		})
		return await this.clientRepository.save(client)
	}

	async findAll(): Promise<ClientMinimalDto[]> {
		const clients = await this.clientRepository.find()

		if (clients.length === 0) {
			return []
		}

		return plainToClass(ClientMinimalDto, clients, { excludeExtraneousValues: true })
	}

	// Найти клиента по ID
	async findOne(id: number): Promise<ClientDto> {
		const client = await this.clientRepository.findOne({
			where: { client_id: id },
			relations: ['projects', 'contactDetails']
		})
		throwIfNotFound(client, `Client with id ${id} not found`)

		return plainToClass(ClientDto, client, { excludeExtraneousValues: true })
	}

	async update(id: number, updateClientDto: UpdateClientDto): Promise<Client> {
		const client = await this.clientRepository.findOne({ where: { client_id: id } })

		throwIfNotFound(client, `Client with id ${id} not found`)

		const updatedClient = Object.assign(client, updateClientDto)

		return await this.clientRepository.save(updatedClient)
	}

	async remove(id: number): Promise<{ message: string }> {
		const client = await this.clientRepository.findOne({ where: { client_id: id } })

		throwIfNotFound(client, `Client with id ${id} not found`)

		await this.clientRepository.delete(id)

		return { message: `Client with id ${id} deleted successfully` }
	}
}
