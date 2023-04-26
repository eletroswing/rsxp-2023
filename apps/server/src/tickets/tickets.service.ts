import { PrismaService } from '@/database/prisma.service'
import { Injectable } from '@nestjs/common'

@Injectable()
export class TicketsService {
  constructor(private prisma: PrismaService) {}

  async findUniqueByTicketNumber(ticketNumber: any) {
    if (!ticketNumber) throw new Error('Missing ticket number.')
    return await this.prisma.ticketLink.findUnique({
      where: {
        symplaTicketNumber: ticketNumber,
      },
    })
  }

  async findUniqueByClerkUserId(clerkUserId: any) {
    if (!clerkUserId) throw new Error('Missing clerk user id.')
    return await this.prisma.ticketLink.findUnique({
      where: {
        clerkUserId,
      },
    })
  }

  async deleteUniqueByClerkUserId(clerkUserId: any) {
    if (!clerkUserId) throw new Error('Missing clerk user id.')
    return await this.prisma.ticketLink.delete({
      where: {
        clerkUserId,
      },
    })
  }

  async create(clerkUserId: any, symplaTicketNumber: any) {
    if (!clerkUserId) throw new Error('Missing clerk user id.')
    if (!symplaTicketNumber) throw new Error('Missing sympla ticket number.')
    return await this.prisma.ticketLink.create({
      data: {
        clerkUserId,
        symplaTicketNumber,
      },
    })
  }
}
