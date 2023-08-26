import { Body, Controller, Get, HttpException, HttpStatus, Logger, Param, Post, Req, Res, UseInterceptors } from '@nestjs/common';
import { AppService } from './app.service';
import { Observable, of } from 'rxjs';
import { ResponseInterceptor } from './interceptor/response-interceptor';
import { off } from 'process';
import { ResponseCommunication } from './constants/type-constants';

@Controller('api/earth-mars-comm')
export class AppController {

  private readonly logger:Logger = new Logger(AppController.name)
  constructor(private readonly appService: AppService) {}

  @Post('message')
  action(@Body('message') message:string , @Req() request:Request):Observable<ResponseCommunication>{

    this.logger.log("Inside : AppController : action ");
    console.log('message :' , message);

    const sender = request['sender'];
    console.log(sender);

    const entryTime = request['entryTime'];
    console.log('entryTime :' , entryTime);


    // return of('hello')
    return this.appService.action(message , sender);

  }
}
