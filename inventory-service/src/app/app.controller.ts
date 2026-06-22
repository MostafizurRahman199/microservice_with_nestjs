import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { GrpcMethod } from '@nestjs/microservices';

@Controller()
export class AppController {
  @GrpcMethod('inventoryService', 'CheckStock')
  checkStock(data: { productId: string }) {

    const items: Record<string, number> = {
      'p1': 10,
      'p2': 20,
      'p3': 30
    }

    const quantity = items[data.productId] || 0;
    const isStock = quantity > 0;

    console.log(`Check stock for product ${data.productId}: ${quantity} available`);

    return { availableQuantity: quantity, inStock: isStock }

  }

}
