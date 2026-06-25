import { Controller } from "@nestjs/common";
import { EventPattern, Payload } from "@nestjs/microservices";
import { readDB } from "./product.store";

// This controller doesn't handle HTTP requests. It handles Kafka messages.
@Controller()
export class ProductConsumer {
    
    // Listen for the 'product_created_cqrs' event emitted by our ProductController
    @EventPattern('product_created_cqrs')
    handleProductCreate(
        @Payload()
        data: { 
            id: number;
            name: string;
            price: number;
            description?: string
        }
    ){
        // When the event is received, push the new data into the Read DB
        // This synchronizes the Read Model with the Write Model
        readDB.push(data);
        console.log('CQRS Read Model Updated:', data.name);
    }
}
