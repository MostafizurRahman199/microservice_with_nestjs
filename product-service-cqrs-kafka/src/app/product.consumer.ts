import { Controller } from "@nestjs/common";
import { EventPattern, Payload } from "@nestjs/microservices";
import { readDB } from "./product.store";


@Controller()
export class ProductConsumer {
    
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
        readDB.push(data);
        console.log('CQRS Read Model Updated', data.name);
    }
}
