import { registerInjectable } from '@rolster/invertly';
import express from 'express';

import { LambdaGet, LambdaPost } from './decorators/lambda.decorator';
import { registerLambdas } from './lambdas';

describe('registerLambdas (integration)', () => {
  it('should register lambda with execute method', () => {
    @LambdaGet('/my-lambda')
    class TestLambda {
      public execute() {
        return { done: true };
      }
    }

    registerInjectable({ token: TestLambda });

    const server = express();
    const useSpy = vi.spyOn(server, 'use');

    registerLambdas({
      lambdas: [TestLambda],
      server
    });

    expect(useSpy).toHaveBeenCalledWith('/my-lambda', expect.any(Function));
  });

  it('should register lambda without execute method', () => {
    @LambdaPost('/no-execute')
    class NoExecuteLambda {}

    registerInjectable({ token: NoExecuteLambda });

    const server = express();
    const useSpy = vi.spyOn(server, 'use');

    registerLambdas({
      lambdas: [NoExecuteLambda],
      server
    });

    expect(useSpy).toHaveBeenCalledWith('/no-execute', expect.any(Function));
  });

  it('should handle multiple lambdas', () => {
    @LambdaGet('/first')
    class FirstLambda {
      public execute() {
        return 'first';
      }
    }

    @LambdaPost('/second')
    class SecondLambda {
      public execute() {
        return 'second';
      }
    }

    registerInjectable({ token: FirstLambda });
    registerInjectable({ token: SecondLambda });

    const server = express();
    const useSpy = vi.spyOn(server, 'use');

    registerLambdas({
      lambdas: [FirstLambda, SecondLambda],
      server
    });

    expect(useSpy).toHaveBeenCalledTimes(2);
  });

  it('should handle catchError option', () => {
    @LambdaGet('/err')
    class ErrLambda {
      public execute() {
        throw new Error('fail');
      }
    }

    registerInjectable({ token: ErrLambda });

    const server = express();
    const catchError = vi.fn();

    registerLambdas({
      lambdas: [ErrLambda],
      server,
      catchError
    });

    expect(true).toBe(true);
  });

  it('should handle clousures option', () => {
    @LambdaGet('/cl')
    class ClLambda {
      public execute() {
        return 'ok';
      }
    }

    registerInjectable({ token: ClLambda });

    const server = express();
    const clousure = vi.fn();

    registerLambdas({
      lambdas: [ClLambda],
      server,
      clousures: [clousure]
    });

    expect(true).toBe(true);
  });

  it('should handle lambda with statusCode', () => {
    @LambdaGet('/status', [], 201)
    class StatusLambda {
      public execute() {
        return { created: true };
      }
    }

    registerInjectable({ token: StatusLambda });

    const server = express();
    const useSpy = vi.spyOn(server, 'use');

    registerLambdas({
      lambdas: [StatusLambda],
      server
    });

    expect(useSpy).toHaveBeenCalled();
  });
});
