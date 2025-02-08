import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { throwIfDuplicate, throwIfNotFound } from 'src/utils/common'
import { ContactDetails } from './entities/contact-details.entity'
import { CreateContactDetailsDto } from './dto/create-contact-details.dto'
import { UpdateContactDetailsDto } from './dto/update-contact-details.dto'
import { Client } from 'src/clients/entities/client.entity'

@Injectable()
export class ContactDetailsService {
	constructor(
		@InjectRepository(ContactDetails)
		private readonly contactDetailsRepository: Repository<ContactDetails>,
		@InjectRepository(Client)
		private readonly clientRepository: Repository<Client>
	) {}

	async create(createContactDetailsDto: CreateContactDetailsDto) {
		// Проверка на дубликат
		const duplicate = await this.contactDetailsRepository.findOne({
			where: {
				contactPerson: createContactDetailsDto.contactPerson,
				contactInfo: createContactDetailsDto.contactInfo
			}
		})
		throwIfDuplicate(duplicate, 'Contact details already exist.')

		// Проверка на существование клиента
		const client = await this.clientRepository.findOne({
			where: { client_id: createContactDetailsDto.client_id }
		})
		if (!client) {
			throw new Error('Client not found.')
		}
		throwIfNotFound(client, `Client not found`)

		// Создание и сохранение контактных данных
		const contactDetails = this.contactDetailsRepository.create({
			...createContactDetailsDto,
			client // Устанавливаем связь с клиентом
		})
		return this.contactDetailsRepository.save(contactDetails)
	}

	async findAll() {
		return this.contactDetailsRepository.find()
	}

	async findOne(id: number): Promise<ContactDetails> {
		const contactDetails = await this.contactDetailsRepository.findOne({ where: { id } })
		throwIfNotFound(contactDetails, `Contact details with id ${id} not found`)
		return contactDetails
	}

	async update(id: number, updateContactDetailsDto: UpdateContactDetailsDto) {
		const contactDetails = await this.findOne(id)
		Object.assign(contactDetails, updateContactDetailsDto)
		return this.contactDetailsRepository.save(contactDetails)
	}

	async remove(id: number) {
		const contactDetails = await this.findOne(id)

		throwIfNotFound(contactDetails, `Contact details with id ${id} not found`)

		await this.contactDetailsRepository.remove(contactDetails)
		return { message: `Contact details with id ${id} deleted successfully` }
	}
}
