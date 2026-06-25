import { Controller, Get, Post, Body, Inject } from "@nestjs/common";
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateProductCommand } from './commands/create-product.command';
import { GetProductsQuery } from './queries/get-products.queries';
import { ClientKafka } from "@nestjs/microservices";

@Controller()
export class ProductController {

    constructor(
        // Inject CQRS buses to dispatch our commands and queries
        private readonly commandBus: CommandBus,
        private readonly queryBus: QueryBus,

        // Inject the Kafka client we registered in AppModule to emit events
        @Inject('KAFKA_SERVICE') 
        private readonly kafkaClient: ClientKafka
    ){}

    // --- WRITE PATH (COMMAND) ---
    @Post('product')
    async createProduct(@Body() body: any) {
        // 1. Dispatch the Command to the CommandBus.
        // This command will be picked up by the CreateProductHandler.
        const product = await this.commandBus.execute(
            new CreateProductCommand(body.name, body.price, body.description)
        );

        // 2. Once the product is successfully created in the Write DB, 
        // emit an event to Kafka so the Read DB can be updated asynchronously.
        this.kafkaClient.emit('product_created_cqrs', product);
        
        return product;
    }

    // --- READ PATH (QUERY) ---
    @Get('products')
    async getProducts() {
        // 1. Dispatch the Query to the QueryBus.
        // This query will be picked up by the GetProductsHandler.
        return this.queryBus.execute(
            new GetProductsQuery()
        );
    }
}