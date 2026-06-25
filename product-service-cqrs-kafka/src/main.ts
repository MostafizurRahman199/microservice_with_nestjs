import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
  // 1. Create the main NestJS application instance for HTTP traffic
  const app = await NestFactory.create(AppModule);
  
  // 2. Configure a Hybrid application by adding a Kafka Microservice listener.
  // This allows the app to listen to both HTTP requests (REST) and Kafka events simultaneously.
  app.connectMicroservice({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'product-consumer-cqrs', // Unique ID for this client connection
        brokers: ['localhost:9092'],       // Address of the Kafka broker
      },
      consumer: {
        groupId: 'product-service-cqrs',   // Consumer group ID to share the load across multiple instances
      },
    },
  });

  // 3. Start listening for incoming messages on the connected microservices (Kafka)
  await app.startAllMicroservices();
  
  // 4. Start listening for incoming HTTP requests on port 3000
  await app.listen(3000);
}

bootstrap();
