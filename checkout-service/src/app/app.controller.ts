import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('checkout')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getData() {
    return this.appService.getData();
  }

  @Get('pay')
  async triggerPayment() {
    return this.appService.discoverAndCallPayment();
  }
}
