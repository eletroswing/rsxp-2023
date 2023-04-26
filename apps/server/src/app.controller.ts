import { Controller, Get } from '@nestjs/common'

@Controller()
export class AppController {
  @Get()
  handleGet(): { message: string } {
    return { message: 'online' }
  }
}
