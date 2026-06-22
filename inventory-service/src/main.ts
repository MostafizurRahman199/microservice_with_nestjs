import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule,{
    transport:Transport.GRPC,
    options:{
      package:'inventory',
      protoPath:join(process.cwd(),'libs/proto/inventory.proto'),
      url:'localhost:50051'
    }
  })

  await app.listen();
  console.log("Inventory service is listening via gRPC...");
  
}

bootstrap();
