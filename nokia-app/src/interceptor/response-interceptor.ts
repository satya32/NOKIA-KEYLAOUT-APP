import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common'
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HEADER_REQUEST } from 'src/constants/sender-constanta';
import { ResponseCommunication } from 'src/constants/type-constants';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {

  intercept(context: ExecutionContext, next: CallHandler): Observable<ResponseCommunication> {

    const request = context.switchToHttp().getRequest();
    console.log('Inside : ResponseInterceptor : ');
    
    const sender = request['sender'];
    console.log(' sender :' , sender);

    const receiver = request['receiver'];
    console.log('receiver :' , receiver);
      

    return next.handle().pipe(
      map(response => {
       console.log(' responseMessage In side Interceptor :' ,response);

    const entryTime = new Date().toISOString();
    console.debug(' exit-time :'  , entryTime);

       if(response && sender === HEADER_REQUEST.EARTH){

        console.log('Inside : middleware : if block ');
          return response;
       }else if(response && sender === HEADER_REQUEST.MOON){
        return response;
       }
       
      }),
      catchError((error : Error)=>{
        console.log('inside catch-error : ' , error);
        return of(error);

      })
    );
   
  }
}
