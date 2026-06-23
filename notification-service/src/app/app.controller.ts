// // Controller decorator marks this class as a NestJS controller.
// // In a Kafka microservice, controllers handle incoming Kafka events/messages.
// import { Controller } from '@nestjs/common';

// // EventPattern is used to subscribe to a Kafka topic/event.
// // Payload extracts the message data sent by the producer.
// import { EventPattern, Payload } from '@nestjs/microservices';

// @Controller()
// export class AppController {

//   // Subscribe to the Kafka topic named "user_created".
//   //
//   // Whenever a producer publishes a message to this --> user_created topic,
//   // NestJS automatically invokes this method.
//   //
//   // EventPattern is typically used for fire-and-forget events,
//   // where no response is expected back to the sender.
//   @EventPattern('user_created')
//   handleUserCreated(

//     // Extract the message payload from the Kafka event.
//     //
//     // Example published message:
//     // {
//     //   id: 1,
//     //   name: "John",
//     //   email: "john@example.com"
//     // }
//     //
//     // The payload becomes available in the "data" parameter.
//     @Payload() data: any,
//   ) {

//     // Process the received message.
//     // Here we're simply logging it to the console.
//     console.log(
//       'Received message from user_created topic:',
//       data,
//     );

//     // Real-world examples:
//     // - Send welcome email
//     // - Create notification
//     // - Update analytics
//     // - Log audit events
//     // - Trigger another microservice
//   }
// }

import {Controller, Inject, OnModuleInit} from "@nestjs/common";
import { ClientKafka, EventPattern, Payload } from "@nestjs/microservices";

@Controller()
export class AppController implements OnModuleInit {

    constructor(@Inject('KAFKA_SERVICE') private readonly kafkaClient:ClientKafka){}

    async onModuleInit() {
        this.kafkaClient.connect();
    }

    @EventPattern('user_created')
    handleUserCreated(@Payload() data: any,)
    {
      try {
         console.log('Main Event Received!');
         console.log('Data : ', data);
         throw new Error("Test Error  !");
      } catch (error) {
         const errorMessage = error instanceof Error ? error.message : String(error)
         console.log("Error message : ", errorMessage);
         console.log('Sending Event to DLQ...');
         this.kafkaClient.emit('user_created_dlq', {
          failedData: data,
          error: errorMessage,
          timestamp: new Date().toISOString()
         })  
      }
    }

    @EventPattern('user_created_dlq')
    handleDLQ(@Payload() data: any) {
        console.log('DLQ Event Received!');
        console.log('Data : ', data);
    }
}