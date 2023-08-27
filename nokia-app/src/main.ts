import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ResponseInterceptor } from './interceptor/response-interceptor';
const PORT = 3000;
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // using global interceptor :
   app.useGlobalInterceptors(new ResponseInterceptor())
  await app.listen(PORT)
  .then(()=>{
    console.log(`Server is listening on port ${PORT}`);
  })
  .catch((error)=>{
    console.error('Inside server error catch :' , error);

  })
}
bootstrap();
