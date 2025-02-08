import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ContactDetailsService } from './contact-details.service'
import { ContactDetailsController } from './contact-details.controller'
import { ContactDetails } from './entities/contact-details.entity'
import { Client } from 'src/clients/entities/client.entity'

@Module({
	imports: [TypeOrmModule.forFeature([ContactDetails, Client])],
	controllers: [ContactDetailsController],
	providers: [ContactDetailsService]
})
export class ContactDetailsModule {}
