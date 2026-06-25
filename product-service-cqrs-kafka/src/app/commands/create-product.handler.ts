import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateProductCommand } from './create-product.command';
import { writeDB } from '../product.store';

// Tell NestJS this handler is responsible for executing the CreateProductCommand
@CommandHandler(CreateProductCommand)
export class CreateProductHandler implements ICommandHandler<CreateProductCommand> {
        
    // The core business logic for executing the command
    async execute(command: CreateProductCommand): Promise<any> {
            
            // 1. Create the new product object
            const product = {
                id: Date.now(),
                name: command.name,
                price: command.price,
                description: command.description
            }

            // 2. Save the new product EXCLUSIVELY to the Write DB
            writeDB.push(product);

            // 3. Return the result back to the caller (ProductController)
            return product;
        }
}