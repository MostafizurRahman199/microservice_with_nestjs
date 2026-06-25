/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.connectMicroservice({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'product-consumer-cqrs',
        brokers: ['localhost:9092'],
      },
      consumer: {
        groupId: 'product-service-cqrs',
      },
    },
  })


  await app.startAllMicroservices();
  await app.listen(3000);
}

bootstrap();
