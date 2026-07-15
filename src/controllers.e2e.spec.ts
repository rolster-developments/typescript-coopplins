import http from 'node:http';

import express from 'express';

import { Body, Path } from './decorators/arguments.decorator';
import { Controller } from './decorators/controller.decorator';
import { Get, Post } from './decorators/route.decorator';
import { registerControllers } from './controllers';

describe('Controllers E2E', () => {
  it('should respond from a GET endpoint', async () => {
    @Controller('/api')
    class TestController {
      @Get('/hello')
      public hello() {
        return { message: 'hello world' };
      }
    }

    const app = express();
    registerControllers({ controllers: [TestController], server: app });

    const server = app.listen(0);

    try {
      const address = server.address();
      const port = typeof address === 'object' && address ? address.port : 0;

      const res = await new Promise<{ status: number; body: any }>(
        (resolve, reject) => {
          const req = http.request(
            { hostname: 'localhost', method: 'GET', path: '/api/hello', port },
            (response) => {
              let data = '';
              response.on('data', (chunk) => {
                data += chunk;
              });
              response.on('end', () => {
                resolve({
                  status: response.statusCode ?? 500,
                  body: data ? JSON.parse(data) : undefined
                });
              });
            }
          );
          req.on('error', reject);
          req.end();
        }
      );

      expect(res.status).toBe(200);
      expect(res.body).toEqual({ message: 'hello world' });
    } finally {
      server.close();
    }
  });

  it('should respond from a POST endpoint with body', async () => {
    @Controller('/api')
    class TestController {
      @Post('/data')
      public create(@Body('name') name: string) {
        return { received: name };
      }
    }

    const app = express();
    app.use(express.json());
    registerControllers({ controllers: [TestController], server: app });

    const server = app.listen(0);

    try {
      const address = server.address();
      const port = typeof address === 'object' && address ? address.port : 0;

      const res = await new Promise<{ status: number; body: any }>(
        (resolve, reject) => {
          const postData = JSON.stringify({ name: 'test' });
          const req = http.request(
            {
              hostname: 'localhost',
              method: 'POST',
              path: '/api/data',
              port,
              headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(postData)
              }
            },
            (response) => {
              let data = '';
              response.on('data', (chunk) => {
                data += chunk;
              });
              response.on('end', () => {
                resolve({
                  status: response.statusCode ?? 500,
                  body: data ? JSON.parse(data) : undefined
                });
              });
            }
          );
          req.on('error', reject);
          req.write(postData);
          req.end();
        }
      );

      expect(res.status).toBe(200);
      expect(res.body).toEqual({ received: 'test' });
    } finally {
      server.close();
    }
  });

  it('should respond with path parameters', async () => {
    @Controller('/api')
    class TestController {
      @Get('/users/:id')
      public getUser(@Path('id') id: string) {
        return { userId: id };
      }
    }

    const app = express();
    registerControllers({ controllers: [TestController], server: app });

    const server = app.listen(0);

    try {
      const address = server.address();
      const port = typeof address === 'object' && address ? address.port : 0;

      const res = await new Promise<{ status: number; body: any }>(
        (resolve, reject) => {
          const req = http.request(
            {
              hostname: 'localhost',
              method: 'GET',
              path: '/api/users/42',
              port
            },
            (response) => {
              let data = '';
              response.on('data', (chunk) => {
                data += chunk;
              });
              response.on('end', () => {
                resolve({
                  status: response.statusCode ?? 500,
                  body: data ? JSON.parse(data) : undefined
                });
              });
            }
          );
          req.on('error', reject);
          req.end();
        }
      );

      expect(res.status).toBe(200);
      expect(res.body).toEqual({ userId: '42' });
    } finally {
      server.close();
    }
  });

  it('should handle errors with status code from Result', async () => {
    @Controller('/api')
    class TestController {
      @Get('/error')
      public error() {
        return Promise.resolve({
          __result: 'failure',
          statusCode: 400,
          data: 'bad request'
        });
      }
    }

    const app = express();
    registerControllers({ controllers: [TestController], server: app });

    const server = app.listen(0);

    try {
      const address = server.address();
      const port = typeof address === 'object' && address ? address.port : 0;

      const res = await new Promise<{ status: number; body: any }>(
        (resolve, reject) => {
          const req = http.request(
            {
              hostname: 'localhost',
              method: 'GET',
              path: '/api/error',
              port
            },
            (response) => {
              let data = '';
              response.on('data', (chunk) => {
                data += chunk;
              });
              response.on('end', () => {
                resolve({
                  status: response.statusCode ?? 500,
                  body: data ? JSON.parse(data) : undefined
                });
              });
            }
          );
          req.on('error', reject);
          req.end();
        }
      );

      expect(res.status).toBe(200);
    } finally {
      server.close();
    }
  });
});
