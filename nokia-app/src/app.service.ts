import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { Observable, concatMap, forkJoin, from, map, of, reduce, switchMap } from 'rxjs';
import { HEADER_REQUEST } from './constants/sender-constanta';
import { ResponseCommunication } from './constants/type-constants';
// import { SENDER } from './constants/sender-constanta';

const nokiaKeypadLayout : Record<string, string>={
      a: "2", b: "22", c: "222",
      d: "3", e: "33", f: "333",
      g: "4", h: "44", i: "444",
      j: "5", k: "55", l: "555",
      m: "6", n: "66", o: "666",
      p: "7", q: "77", r: "777", s: "7777",
      t: "8", u: "88", v: "888",
      w: "9", x: "99", y: "999", z: "9999",
      " ": " "
    };

@Injectable()
export class AppService {
  private readonly logger:Logger = new Logger(AppService.name);
  constructor(){

  }
  /* 
  Main function : action 
  */ 
  action(message:string , sender:string):Observable<ResponseCommunication>{

    if(!message){
      throw new HttpException('Please enter valid Input' ,HttpStatus.BAD_REQUEST);

    }
    this.logger.log('Inside : AppService : action');

    console.log('request : ' , message);
    console.log('sender :' , sender);
  
    if(sender === HEADER_REQUEST.EARTH){

    return this.messageToMoon(message).pipe(
     switchMap((responseMessage:string)=>{

        console.log('responseMessage :' , responseMessage);
        return of({
          responseFromMoon :responseMessage,
          nokiaTranslations: message
        });
     })
    )
    }else if(sender === HEADER_REQUEST.MOON){

    return this.messageToEarth(message).pipe(
     switchMap((responseData:string)=>{

      console.log(' responseData :' , responseData);

      return of({
        responseFromEarth :responseData,
        nokiaTranslations: message
      });
     })
    )
    }
  }
/* 
This Function : messageToMoon : used to convert string to ,
 combination of number using nokia keypad layout;

*/ 
  messageToMoon(message:string):Observable<string>{
    this.logger.log('Inside : convertToNokiaLayout :');

    console.log('message :' , message);
     return this.convertToNokiaLayout(message).pipe(
      map((responseData:string)=>{
        console.log(" responseData :" , responseData);

        return responseData
      })
     )
   
  }

 /*
Helper function : convertToNokiaLayout : string to number;
*/ 
 convertToNokiaLayout(inputString:string):Observable<string>{
  this.logger.log('Inside : convertToNokiaLayout :');


  return of(inputString).pipe(
    map(input => input.toLowerCase().split('')),
    map(chars => chars.map(char => nokiaKeypadLayout[char] || char)),
    map(mappedChars => mappedChars.join(''))
);
    // return inputString
    // .toLowerCase()
    // .split('')
    // .map(char => nokiaKeypadLayout[char] || char)
    // .join('');
      
  }
  /* 
This Function : messageToEarth : used to convert number to ,
 combination of string using nokia keypad layout;

*/ 
   messageToEarth(message:string):Observable<string>{

    this.logger.log('Inside : convertToStandardLayout :');

    const words = message.split("  "); // Split by double space to separate words
    console.log('words :' , words);
    let  responseData : string = '';
    
    return from(words).pipe(
      concatMap(data =>
          this.findRepeatedNumberCombinations(data).pipe(
              concatMap(combinationNumber =>
                  this.combinationOfString(combinationNumber)
              )
          )
      ),
      reduce((responseData, messageString) => responseData + messageString, '')
  );

    // for(const data of words){

    //   const combinationNumber:string[] = this.findRepeatedNumberCombinations(data);

    //  console.log(' combinationNumber :' , combinationNumber);
    //  responseData += this.combinationOfString(combinationNumber);

    // console.log(' messageString : ' ,responseData);
    // //  responseData += messageString;
    // }
    // console.log('message-string : ' , responseData);

    // return of(responseData);
  }

/*
Helper function to combine string;
*/ 
 combinationOfString(input:string[]):Observable<string>
 {
  this.logger.log('Inside : combinationOfString :');
  let responseString :string = '';


  return from(input).pipe(
    concatMap(value => 
      this.fetchKeyFromObject(value)
      
      ),
      reduce((responseData, messageString) => responseData + messageString, '')
  )
  // for(const value  of input ){
  //   responseString += this.fetchKeyFromObject(value);

  // }

  // return of(responseString);
 }

/*
Helper function : fetchKeyFromObject : fetching each key :;
*/ 

 fetchKeyFromObject(value:string):Observable<string>{
  this.logger.debug('Inside : fetchKeyFromObject :');

  for(const key in nokiaKeypadLayout){
    if(nokiaKeypadLayout[key] === value){
      return of(key);
    }
  }

 }

  /*
Helper function : findRepeatedNumberCombinations : Find the combination of repeated number.
*/ 
 findRepeatedNumberCombinations(inputString:string):Observable<string[]> {
        const repeatedCombinations :string[] = [];

        console.log(' string : ' , inputString);
        let i = 0;
      
        while (i < inputString.length) {
          let j = i + 1;
         let count = 0;
          while (j < inputString.length && inputString[j] === inputString[i]) {
          //  count++;
            j++;
          }
          // j = count;
           const substringLength = inputString.substring(i, j).length;
           
           console.log('substringLength :' , substringLength);
         //  TODO : need to handle multiple case of combination if number  is repeated more than 3 or 4;

         // TODO : Need to handle the combinations of string ;
      
          repeatedCombinations.push(inputString.substring(i, j));
          i = j;
        }
      
        return of (repeatedCombinations);
      }


}
