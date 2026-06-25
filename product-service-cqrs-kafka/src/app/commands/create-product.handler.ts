import {CommandHandler, ICommandHandler} from '@nestjs/cqrs';
import {CreateProductCommand} from './create-product.command';
import { writeDB } from '../product.store';

@CommandHandler(CreateProductCommand)
export class CreateProductHandler implements ICommandHandler<CreateProductCommand>{
        
    async execute(command: CreateProductCommand): Promise<any> {
            
            const product = {
                id: Date.now(),
                name: command.name,
                price: command.price,
                description: command.description
            }

            writeDB.push(product);

            return product;
        }
}