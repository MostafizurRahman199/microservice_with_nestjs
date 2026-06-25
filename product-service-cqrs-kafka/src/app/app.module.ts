import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ProductController } from './product.controller';
import { ProductConsumer } from './product.consumer';
import { CreateProductHandler } from './commands/create-product.handler';
import { GetProductsHandler } from './queries/get-products.handler';

@Module({
  imports: [CqrsModule, ClientsModule.register([
    {
      name: 'KAFKA_SERVICE',
      transport: Transport.KAFKA,
      options: {
        client: {
          clientId: 'product-service-cqrs',
          brokers: ['localhost:9092'],
        },
        consumer: {
          groupId: 'product-service-cqrs',
        },
      },
    },
  ])],
  controllers: [ProductController,ProductConsumer],
  providers: [CreateProductHandler,GetProductsHandler],
})
export class AppModule {}
