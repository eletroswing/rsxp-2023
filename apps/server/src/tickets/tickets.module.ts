import { Module } from '@nestjs/common'
import { TicketsController } from './tickets.controller'
import { TicketsService } from './tickets.service'
import { PrismaService } from '@/database/prisma.service'
import { SymplaService } from '@/sympla/sympla.service'

@Module({
  controllers: [TicketsController],
  providers: [PrismaService, TicketsService, SymplaService],
})
export class TicketsModule {}
