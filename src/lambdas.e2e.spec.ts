import http from 'node:http';

import { registerInjectable } from '@rolster/invertly';
import express from 'express';

import { LambdaGet, LambdaPost } from './decorators/lambda.decorator';
import { registerLambdas } from './lambdas';

describe('Lambdas E2E', () => {
  it('should respond from a lambda GET endpoint', async () => {
    @LambdaGet('/hello')
    class TestLambda {
      public execute() {
        return { message: 'hello from lambda' };
      }
    }

    registerInjectable({ token: TestLambda });

    const app = express();
    registerLambdas({ lambdas: [TestLambda], server: app });

    const server = app.listen(0);

    try {
      const address = server.address();
      const port = typeof address === 'object' && address ? address.port : 0;

      const res = await new Promise<{ status: number; body: any }>(
        (resolve, reject) => {
          const req = http.request(
            { hostname: 'localhost', method: 'GET', path: '/hello', port },
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
      expect(res.body).toEqual({ message: 'hello from lambda' });
    } finally {
      server.close();
    }
  });

  it('should respond from a lambda POST endpoint', async () => {
    @LambdaPost('/submit')
    class TestLambda {
      public execute() {
        return { submitted: true };
      }
    }

    registerInjectable({ token: TestLambda });

    const app = express();
    registerLambdas({ lambdas: [TestLambda], server: app });

    const server = app.listen(0);

    try {
      const address = server.address();
      const port = typeof address === 'object' && address ? address.port : 0;

      const res = await new Promise<{ status: number; body: any }>(
        (resolve, reject) => {
          const req = http.request(
            { hostname: 'localhost', method: 'POST', path: '/submit', port },
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
      expect(res.body).toEqual({ submitted: true });
    } finally {
      server.close();
    }
  });

  it('should handle lambda without execute method', async () => {
    @LambdaGet('/noop')
    class NoopLambda {}

    registerInjectable({ token: NoopLambda });

    const app = express();
    registerLambdas({ lambdas: [NoopLambda], server: app });

    const server = app.listen(0);

    try {
      const address = server.address();
      const port = typeof address === 'object' && address ? address.port : 0;

      const res = await new Promise<{ status: number; body: any }>(
        (resolve, reject) => {
          const req = http.request(
            { hostname: 'localhost', method: 'GET', path: '/noop', port },
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
