import { Controller, Param, Get, Patch, Body, UseGuards  } from "@nestjs/common";
import { AppService } from "./app.service";
import { RateLimitGuard } from "../guards/rate-limit.guard";



@Controller()
export class AppController{
  
  constructor(
    private readonly appService:AppService
  ){}


  @Get('products/:id')
  getProduct(@Param('id') id:string){
    return this.appService.getProduct(Number(id));
  }

  @Patch('products/:id')
  updateProduct(
    @Param('id') id:string, 
    @Param('price') price:string
  ){ 
    return this.appService.updateProduct(
      Number(id),
      Number(price)
    );
  }

  @Get('test')
  @UseGuards(RateLimitGuard)
  testEndpoint(){
    return 'This is test endpoint';
  }
}
