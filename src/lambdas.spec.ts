import express from 'express';

import { LambdaGet } from './decorators/lambda.decorator';
import { registerLambdas } from './lambdas';

describe('registerLambdas', () => {
  it('should register lambda routes on the server', () => {
    @LambdaGet('/my-lambda')
    class TestLambda {
      public execute() {
        return { done: true };
      }
    }

    const server = express();
    const useSpy = vi.spyOn(server, 'use');

    registerLambdas({
      lambdas: [TestLambda],
      server
    });

    expect(useSpy).toHaveBeenCalledWith(
      '/my-lambda',
      expect.any(Function)
    );
  });

  it('should handle catchError option', () => {
    @LambdaGet('/test-lambda')
    class TestLambda {
      public execute() {
        return 'ok';
      }
    }

    const server = express();
    const catchError = vi.fn();

    expect(() => {
      registerLambdas({
        lambdas: [TestLambda],
        server,
        catchError
      });
    }).not.toThrow();
  });

  it('should handle clousures option', () => {
    @LambdaGet('/test-lambda')
    class TestLambda {
      public execute() {
        return 'ok';
      }
    }

    const server = express();
    const clousure = vi.fn();

    expect(() => {
      registerLambdas({
        lambdas: [TestLambda],
        server,
        clousures: [clousure]
      });
    }).not.toThrow();
  });

  it('should handle lambda without execute method', () => {
    @LambdaGet('/no-execute')
    class NoExecuteLambda {}

    const server = express();

    expect(() => {
      registerLambdas({
        lambdas: [NoExecuteLambda],
        server
      });
    }).not.toThrow();
  });
});
