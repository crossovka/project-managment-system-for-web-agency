import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { plainToClass } from 'class-transformer'

import { throwIfDuplicate, throwIfNotFound } from 'src/utils/common'

import { Access } from './entities/access.entity'
import { Project } from 'src/projects/entities/project.entity'

import { CreateAccessDto } from './dto/create-access.dto'
import { UpdateAccessDto } from './dto/update-access.dto'
import { ProjectMinimalDto } from 'src/projects/dto/project-minimal.dto'
import { AccessDto } from './dto/access.dto'

@Injectable()
export class AccessService {
	constructor(
		@InjectRepository(Access)
		private readonly accessRepository: Repository<Access>,
		@InjectRepository(Project)
		private readonly projectRepository: Repository<Project>
	) {}

	// Создание нового доступа
	async create(createAccessDto: CreateAccessDto): Promise<AccessDto> {
		// Проверка существования проекта с таким ID
		const project = await this.projectRepository.findOne({
			select: ['project_id', 'name'], // Выбираем только нужные поля
			where: { project_id: createAccessDto.projectId }
		})

		throwIfNotFound(project, `Project with ID ${createAccessDto.projectId} not found`)

		// Проверка на существующий доступ для этого проекта с таким названием ресурса
		const existingAccess = await this.accessRepository.findOne({
			where: {
				project: { project_id: createAccessDto.projectId },
				resourceName: createAccessDto.resourceName
			}
		})

		throwIfDuplicate(
			existingAccess,
			`Access already exists for this project with the same resource name`
		)

		// Создаем доступ
		const access = this.accessRepository.create({
			...createAccessDto,
			project: project
		})

		const savedAccess = await this.accessRepository.save(access)

		// Преобразуем в DTO перед возвращением
		return plainToClass(AccessDto, savedAccess)
	}

	// Получение всех доступов
	async findAll(): Promise<AccessDto[]> {
		const accesses = await this.accessRepository.find({
			relations: ['project']
		})

		// Проверка, если доступы не найдены
		throwIfNotFound(accesses, 'No accesses found')

		// Преобразуем все доступы в AccessDto с минимальной информацией о проекте
		const accessDtos = accesses.map((access) =>
			plainToClass(AccessDto, {
				...access,
				project: {
					project_id: access.project.project_id,
					name: access.project.name
				}
			})
		)

		return accessDtos
	}

	// Получение одного доступа по ID
	async findOne(id: number): Promise<AccessDto> {
		const access = await this.accessRepository.findOne({
			where: { access_id: id },
			relations: ['project']
		})

		// Проверка, если доступ не найден
		throwIfNotFound(access, `Access with ID ${id} not found`)

		// Преобразуем доступ в DTO с минимальной информацией о проекте
		return plainToClass(AccessDto, {
			...access,
			project: {
				project_id: access.project.project_id,
				name: access.project.name
			}
		})
	}

	// Обновление доступа
	async update(id: number, updateAccessDto: UpdateAccessDto): Promise<AccessDto> {
		const access = await this.accessRepository.findOne({
			where: { access_id: id },
			relations: ['project']
		})
		throwIfNotFound(access, `Access with ID ${id} not found`)

		// Обновление полей
		const updatedAccess = Object.assign(access, updateAccessDto)

		// Сохранение обновленного доступа
		const savedAccess = await this.accessRepository.save(updatedAccess)

		// Преобразуем сохраненный доступ в DTO с минимальной информацией о проекте
		return plainToClass(AccessDto, {
			...savedAccess,
			project: {
				project_id: savedAccess.project.project_id,
				name: savedAccess.project.name
			}
		})
	}

	async remove(id: number): Promise<{
		message: string
		// deletedAccess: AccessDto
	}> {
		const access = await this.accessRepository.findOne({ where: { access_id: id } })
		throwIfNotFound(access, `Access with ID ${id} not found`)

		// // Сохраняем информацию о том, что удалено
		// const deletedAccess = plainToClass(AccessDto, access)

		// Удаляем запись
		await this.accessRepository.remove(access)

		// Возвращаем сообщение об успешном удалении и информацию о том, что было удалено
		return {
			message: `Access with ID ${id} has been successfully removed.`
			// deletedAccess
		}
	}
}
