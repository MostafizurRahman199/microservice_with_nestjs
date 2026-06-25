import { Controller, Get, Post, Body, Inject } from "@nestjs/common";
import {CommandBus, QueryBus} from '@nestjs/cqrs';
import {CreateProductCommand} from './commands/create-product.command';
import {GetProductsQuery} from './queries/get-products.queries';
import { ClientKafka } from "@nestjs/microservices";



@Controller()
export class ProductController{

    constructor(
        private readonly commandBus: CommandBus,
        private readonly queryBus: QueryBus,

        @Inject('KAFKA_SERVICE') 
        private readonly kafkaClient: ClientKafka
    ){}

    @Post('product')
    async createProduct(@Body() body:any ){
        const product = await this.commandBus.execute(
            new CreateProductCommand(body.name, body.price, body.description)
        );

        this.kafkaClient.emit('product_created_cqrs', product);
        return product;
    }

    @Get('products')
    async getProducts(){
        return this.queryBus.execute(
            new GetProductsQuery()
        );
    }
}