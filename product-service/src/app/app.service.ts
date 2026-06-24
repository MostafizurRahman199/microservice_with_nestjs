import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Inject, Injectable } from "@nestjs/common";
import type { Cache } from "cache-manager";
import { products } from "./fake-db";

@Injectable()
export class AppService{
  constructor(
    @Inject(CACHE_MANAGER) 
    private readonly cacheManager:Cache
  ){}

  async getProduct(id:number){
    const cacheKey = `product:${id}`;
    const cachedProduct = await this.cacheManager.get(cacheKey);
    if(cachedProduct){
      console.log('Cache hit');
      return cachedProduct;
    }
    console.log('Cache Miss');
    const product = products.find((product)=> product.id === id);
    if(!product){
      console.log('Product not found');
       return {
        message:'Product not found',
        success:false
       };
    }
    await this.cacheManager.set(cacheKey, product);
    return product;
  }


  async updateProduct(id:number, price:number){
    const product = products.find((product)=> product.id === id);
    if(!product){
      return {
        message:'Product not found',
        success:false
      };
    }
    product.price = price;
    const cacheKey = `product:${id}`;
    await this.cacheManager.set(cacheKey, product);
    return {
      message:'Product updated successfully',
      data:product
    };
  }


}



