import { ClerkGuard } from '@/clerk/clerk.guard'
import { TicketsService } from '@/tickets/tickets.service'
import { RequireAuthProp, users } from '@clerk/clerk-sdk-node'
import { Controller, Get, Req, UseGuards } from '@nestjs/common'
import { Request } from 'express'

@Controller('credential')
export class CredentialController {
  constructor(private tickets: TicketsService) {}

  @Get()
  @UseGuards(ClerkGuard)
  async handleGet(@Req() req: RequireAuthProp<Request>) {
    const { userId } = req.auth

    const { ticketNumber } = await this.tickets.findUniqueByClerkUserId(userId)

    const user = await users.getUser(userId)
    // TODO: Return QRCode data and bio from github

    return {
      ticketNumber,
      user: {
        avatarUrl: user.profileImageUrl,
        name: `${user.firstName} ${user.lastName}`,
      },
    }
  }
}
