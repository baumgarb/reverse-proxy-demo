import { Module, NestModule, RequestMethod } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ReverseProxyMiddleware } from './reverse-proxy.middleware';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule implements NestModule {
  configure(consumer: import('@nestjs/common').MiddlewareConsumer) {
    consumer
      .apply(ReverseProxyMiddleware)
      .forRoutes({ path: 'v2/todos-api', method: RequestMethod.ALL });
  }
}
