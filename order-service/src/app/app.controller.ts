import { Controller, Get, Inject, Param } from '@nestjs/common';
import { AppService } from './app.service';
import {ClientProxy} from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Controller('orders')
export class AppController {

  constructor(@Inject('AUTH_SERVICE') private readonly authClient:ClientProxy){}

  @Get(':id')
  async createOrder(@Param('id') userId:string){
    const pattern = {cmd:"validate_user"}
    const payload = {userId:Number(userId)};

    const authResponse = await firstValueFrom(this.authClient.send(pattern,payload));

    if(authResponse.status === 'success'){
      return {
        message :'Order created successfully',
        user:authResponse.user
      }
    }
    return {
      message:'order creation failed',
      reason:authResponse.error
    }
  }
}
