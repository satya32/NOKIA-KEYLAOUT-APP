import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ResponseInterceptor } from './interceptor/response-interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // using global interceptor :
   app.useGlobalInterceptors(new ResponseInterceptor())
  await app.listen(3000);
}
bootstrap();
