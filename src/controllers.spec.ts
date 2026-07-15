import express from 'express';

import { Controller } from './decorators/controller.decorator';
import { Get, Post } from './decorators/route.decorator';
import { registerControllers } from './controllers';
import { Body } from './decorators/arguments.decorator';

describe('registerControllers', () => {
  it('should register controller routes on the server', () => {
    @Controller('/api')
    class TestController {
      @Get('/hello')
      public hello() {
        return { message: 'hello' };
      }

      @Post('/data')
      public create(@Body('name') _name: string) {
        return { created: true };
      }
    }

    const server = express();
    const useSpy = vi.spyOn(server, 'use');

    registerControllers({
      controllers: [TestController],
      server
    });

    expect(useSpy).toHaveBeenCalledWith(
      '/api',
      expect.any(Function)
    );
  });

  it('should handle catchError option', () => {
    @Controller('/test')
    class TestController {
      @Get('/')
      public index() {
        return 'ok';
      }
    }

    const server = express();
    const catchError = vi.fn();

    expect(() => {
      registerControllers({
        controllers: [TestController],
        server,
        catchError
      });
    }).not.toThrow();
  });

  it('should handle clousures option', () => {
    @Controller('/test')
    class TestController {
      @Get('/')
      public index() {
        return 'ok';
      }
    }

    const server = express();
    const clousure = vi.fn();

    expect(() => {
      registerControllers({
        controllers: [TestController],
        server,
        clousures: [clousure]
      });
    }).not.toThrow();
  });
});
