import { NestMiddleware, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import * as proxy from 'http-proxy-middleware';

export class ReverseProxyMiddleware implements NestMiddleware {
  private proxy = proxy({
    target: 'http://localhost:8090/api',
    pathRewrite: {
      '/api/v2/todos-api': ''
    },
    secure: false,
    onProxyReq: (proxyReq, req, res) => {
      console.log(
        `[NestMiddleware]: Proxying ${req.method} request originally made to '${req.originalUrl}'...`
      );
    }
  });

  constructor() {}

  use(req: Request, res: Response, next: () => void) {
    this.proxy(req, res, next);
  }
}
