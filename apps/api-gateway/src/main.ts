/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 **/

import { NestFactory } from '@nestjs/core';

import { AppModule } from './app/app.module';
import * as proxy from 'http-proxy-middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);

  app.use((req, _, next) => {
    console.log(`Got invoked: '${req.originalUrl}'`);
    next();
  });

  app.use(
    '/api/v1/todos-api',
    proxy({
      target: 'http://localhost:8090/api',
      pathRewrite: {
        '/api/v1/todos-api': ''
      },
      secure: false,
      onProxyReq: (proxyReq, req, res) => {
        console.log(
          `[Global Functional Middlware]: Proxying ${req.method} request originally made to '${req.originalUrl}'...`
        );
      }
    })
  );

  const port = 8080;
  await app.listen(port, () => {
    console.log('Listening at http://localhost:' + port + '/' + globalPrefix);
  });
}

bootstrap();
