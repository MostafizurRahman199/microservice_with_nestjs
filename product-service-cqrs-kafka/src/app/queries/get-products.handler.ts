import {QueryHandler, IQueryHandler} from '@nestjs/cqrs';
import {GetProductsQuery} from './get-products.queries';
import { readDB } from '../product.store';

@QueryHandler(GetProductsQuery)
export class GetProductsHandler implements IQueryHandler<GetProductsQuery>{
    
    async execute(){
        return readDB;
    }

}