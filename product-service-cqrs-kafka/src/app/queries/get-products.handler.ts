import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { GetProductsQuery } from './get-products.queries';
import { readDB } from '../product.store';

// Tell NestJS this handler is responsible for executing the GetProductsQuery
@QueryHandler(GetProductsQuery)
export class GetProductsHandler implements IQueryHandler<GetProductsQuery> {
    
    // The core logic for fetching the data
    async execute() {
        // 1. Read the data EXCLUSIVELY from the Read DB
        // The read model is completely unaware of the write operations
        return readDB;
    }

}