import { registerInjectable } from '@rolster/invertly';

import { createMiddleware, createMiddlewares } from './middleware.factory';
import { registerMiddleware } from '../stores/middlerare.store';

describe('createMiddleware', () => {
  it('should return the token as-is when it is not a function', () => {
    const validationChain: any = [() => {}];

    const result = createMiddleware(validationChain);

    expect(result.isPresent()).toBe(true);
    expect(result.get()).toBe(validationChain);
  });

  it('should wrap a plain function as middleware', () => {
    const fn = vi.fn();

    const result = createMiddleware(fn);

    expect(result.isPresent()).toBe(true);

    const middleware = result.get();

    const req = {} as any;
    const res = {} as any;
    const next = vi.fn();

    (middleware as any)(req, res, next);

    expect(fn).toHaveBeenCalledWith(req, res, next);
  });

  it('should instantiate a registered middleware class', () => {
    class TestMiddleware {
      public middleware(req: any, res: any, next: any) {
        next();
      }
    }

    registerMiddleware(TestMiddleware);
    registerInjectable({ token: TestMiddleware });

    const result = createMiddleware(TestMiddleware);

    expect(result.isPresent()).toBe(true);
  });
});

describe('createMiddlewares', () => {
  it('should create multiple middlewares from tokens', () => {
    const fn1 = vi.fn();
    const fn2 = vi.fn();

    const middlewares = createMiddlewares([fn1, fn2]);

    expect(middlewares).toHaveLength(2);
  });

  it('should filter out empty results', () => {
    class NoMiddleware {}

    registerMiddleware(NoMiddleware);
    registerInjectable({ token: NoMiddleware });

    const middlewares = createMiddlewares([NoMiddleware]);

    expect(middlewares).toHaveLength(0);
  });
});
