import { Controller, Get, Inject, OnModuleInit, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { firstValueFrom, lastValueFrom, Observable } from 'rxjs';
import { type ClientGrpc } from '@nestjs/microservices';


interface InventoryService {
  checkStock(data:{productId:string}):Observable<any>;
}


@Controller('orders-2')
export class AppController implements OnModuleInit{

  private inventoryService!:InventoryService;

  constructor(@Inject('INVENTORY_PACKAGE') private client:ClientGrpc){};

  onModuleInit(){
    this.inventoryService = this.client.getService<InventoryService>('inventoryService');
  }

  @Get('check-item')
  async checkItem(@Query('pid') pid:string)
  {
    const stockRes = await lastValueFrom(
      this.inventoryService.checkStock({
        productId:pid
      }));

    if(stockRes.inStock){
      return {
        status :'Available',
        quantity:stockRes.availableQuantity,
        message:'item is in stock'
      }
    }
    return {
      status:'Not Available',
      quantity:stockRes.availableQuantity,
      message:'item is not in stock'
    }
  }

}
