// Import decorators and interfaces from NestJS
import {
  Controller,
  Get,
  Inject,
  OnModuleInit,
} from '@nestjs/common';

// ClientKafka is used to communicate with Kafka as a producer
import { ClientKafka } from '@nestjs/microservices';

@Controller()
export class AppController implements OnModuleInit {

  constructor(

    // Inject the Kafka client registered with the token "KAFKA_SERVICE"
    //
    // This allows the controller to publish messages/events
    // to Kafka topics.
    @Inject('KAFKA_SERVICE')
    private readonly kafkaClient: ClientKafka,
  ) {}

  // Lifecycle hook that runs automatically
  // when the module is initialized.
  async onModuleInit() {

    // Establish connection to Kafka broker.
    //
    // Without this connection, the service cannot
    // publish messages to Kafka topics.
    await this.kafkaClient.connect();
  }

  // HTTP GET endpoint
  //
  // URL:
  // GET http://localhost:3000/create-user
  @Get('create-user')
  createUser() {

    // Simulating a newly created user.
    //
    // Normally this data would come from:
    // - Database
    // - Request body
    // - External API
    const user = {
      id: 1,
      name: 'Mostafiz',
      email: '[EMAIL_ADDRESS]',
    };

    // Publish an event to Kafka.
    //
    // Topic Name:
    // user_created
    //
    // Event Data:
    // user object
    //
    // Any microservice listening to
    // "user_created" will receive this event.
    this.kafkaClient.emit('user_created', user);

    // Return HTTP response to the client
    return {
      message: 'User creation event emitted to Kafka',
      data: user,
    };
  }
}