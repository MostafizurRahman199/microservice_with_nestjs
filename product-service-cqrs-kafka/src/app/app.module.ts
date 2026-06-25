import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ProductController } from './product.controller';
import { ProductConsumer } from './product.consumer';
import { CreateProductHandler } from './commands/create-product.handler';
import { GetProductsHandler } from './queries/get-products.handler';

@Module({
  imports: [
    // 1. Import CqrsModule to enable CommandBus, QueryBus, and EventBus in our application
    CqrsModule, 
    
    // 2. Register Kafka Client so we can inject it and EMIT events to Kafka
    ClientsModule.register([
      {
        name: 'KAFKA_SERVICE', // Injection token used to access this client
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
    ])
  ],
  // 3. Register our controllers (HTTP API endpoints and Kafka consumers)
  controllers: [ProductController, ProductConsumer],
  
  // 4. Register our CQRS Handlers as providers so the buses can route to them
  providers: [CreateProductHandler, GetProductsHandler],
})
export class AppModule {}
