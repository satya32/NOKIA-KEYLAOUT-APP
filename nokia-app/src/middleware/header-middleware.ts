import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction , Response , request } from "express";
import { HEADER_REQUEST,} from "src/constants/sender-constanta";

@Injectable()
export class HeaderMiddleware implements NestMiddleware  { 
    use(req:Request , res:Response, next:NextFunction){
        
     console.log('Inside : header middleware :');
   
    //   Extract the header value;
     const sender = req.headers['x-sender'];
     console.log('sender :' , sender);

    //   set the the value for request handler;

     
     req['sender'] = sender === HEADER_REQUEST.EARTH ?  HEADER_REQUEST.EARTH :  HEADER_REQUEST.MOON;
     console.log('sender :' ,req['sender'] );

     req['receiver'] = sender === HEADER_REQUEST.EARTH ? HEADER_REQUEST.MOON : HEADER_REQUEST.EARTH;
     console.log('receiver :' ,req['receiver'] );
     
    //   logging enter time 
    const entryTime = new Date().toISOString();
    console.debug(' entryTime :'  , entryTime);

    req['entryTime'] = entryTime;

     next()
    }


}