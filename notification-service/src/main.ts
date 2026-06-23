// Import NestFactory which is used to create NestJS applications or microservices
import { NestFactory } from '@nestjs/core';

// Import the root module of the application
import { AppModule } from './app/app.module';

// Import Kafka transport-related types
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {

  // Create a standalone microservice instead of a normal HTTP server.
  // This service will communicate through Kafka.
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      // Specify Kafka as the communication transport layer
      transport: Transport.KAFKA,

      options: {

        // Kafka client configuration
        client: {

          // Unique identifier for this Kafka client.
          // Useful for monitoring and debugging in Kafka.
          clientId: 'notification-consumer',

          // List of Kafka broker addresses.
          // The microservice connects to these brokers to
          // consume and produce messages.
          brokers: ['localhost:9092']
        },

        // Consumer-specific configuration
        consumer: {

          // Consumer Group ID.
          //
          // All consumers with the same groupId belong
          // to the same consumer group.
          //
          // Kafka distributes messages among consumers
          // within the same group so that each message
          // is processed only once by the group.
          groupId: 'notification-group'
        },

        // Subscription behavior when consuming messages
        subscribe: {

          // If true:
          //   Read all existing messages from the beginning
          //   of the topic when no previous offset exists.
          //
          // If false:
          //   Start consuming only new messages.
          //
          // Useful during development/testing to replay
          // old events.
          fromBeginning: true
        }
      }
    }
  );

  // Start listening for Kafka messages
  await app.listen();

  // Log a message to confirm the service is running
  console.log('Notification service is listening via Kafka...');
}

// Start the microservice
bootstrap();