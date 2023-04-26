import { Module } from '@nestjs/common'
import { CredentialController } from './credential.controller'
import { TicketsService } from '@/tickets/tickets.service'
import { PrismaService } from '@/database/prisma.service'

@Module({
  controllers: [CredentialController],
  providers: [TicketsService, PrismaService],
})
export class CredentialModule {}
