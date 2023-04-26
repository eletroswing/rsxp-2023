import { PrismaService } from '@/database/prisma.service'
import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common'
import { TicketsService } from './tickets.service'
import { RequireAuthProp } from '@clerk/clerk-sdk-node'
import { Request } from 'express'
import { ClerkGuard } from '@/clerk/clerk.guard'
import { SymplaService } from '@/sympla/sympla.service'

@Controller('tickets/link')
export class TicketsController {
  constructor(
    private prisma: PrismaService,
    private sympla: SymplaService,
    private tickets: TicketsService,
  ) {}

  @Get()
  @UseGuards(ClerkGuard)
  async getLinkedTicket(@Req() req: RequireAuthProp<Request>) {
    const { userId } = req.auth

    const ticket = await this.tickets.findUniqueByClerkUserId(userId)

    return { ticket }
  }

  @Post()
  @HttpCode(201)
  @UseGuards(ClerkGuard)
  async linkTicket(@Req() req: RequireAuthProp<Request>) {
    const { userId } = req.auth
    const { ticketNumber } = req.body

    const ticketAlreadyInUse = await this.tickets.findUniqueByTicketNumber(
      ticketNumber,
    )

    if (ticketAlreadyInUse && ticketAlreadyInUse.clerkUserId === userId) {
      return
    }

    if (ticketAlreadyInUse) {
      throw new HttpException(
        'Esse ticket já foi utilizado por outro participante.',
        HttpStatus.CONFLICT,
      )
    }

    const userAlreadyLinked = await this.tickets.findUniqueByClerkUserId(userId)

    if (userAlreadyLinked) {
      throw new HttpException(
        'Você já vinculou um ingresso.',
        HttpStatus.CONFLICT,
      )
    }

    try {
      await this.sympla.getParticipantByTicketNumber(ticketNumber)
    } catch (err) {
      throw new HttpException(
        'Número do ticket inválido.',
        HttpStatus.BAD_REQUEST,
      )
    }

    await this.tickets.create(userId, ticketNumber)
  }

  @Delete()
  @HttpCode(204)
  @UseGuards(ClerkGuard)
  async unlinkTicket(@Req() req: RequireAuthProp<Request>) {
    const { userId } = req.auth

    const userTicket = await this.tickets.deleteUniqueByClerkUserId(userId)

    if (!userTicket) {
      throw new HttpException(
        'Você não possui nenhum ingresso vinculado.',
        HttpStatus.I_AM_A_TEAPOT,
      )
    }

    await this.tickets.deleteUniqueByClerkUserId(userId)
  }
}
