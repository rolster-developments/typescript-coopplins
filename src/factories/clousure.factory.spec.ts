import { registerInjectable } from '@rolster/invertly';

import { createClousure, createClousures } from './clousure.factory';
import { registerClousure } from '../stores/clousure.store';

describe('createClousure', () => {
  it('should wrap a plain function as clousure', () => {
    const fn = vi.fn();

    const result = createClousure(fn);

    expect(result.isPresent()).toBe(true);

    const req = {} as any;
    const res = {} as any;

    result.get()(req, res);

    expect(fn).toHaveBeenCalledWith(req, res);
  });

  it('should instantiate a registered clousure class', () => {
    class TestClousure {
      public clousure(_req: any, _res: any) {
        // no-op
      }
    }

    registerClousure(TestClousure);
    registerInjectable({
      scopeable: false,
      singleton: false,
      token: TestClousure
    });

    const result = createClousure(TestClousure);

    expect(result.isPresent()).toBe(true);
  });

  it('should return empty for a registered clousure class without clousure method', () => {
    class NoClousureMethod {}

    registerClousure(NoClousureMethod);
    registerInjectable({
      scopeable: false,
      singleton: false,
      token: NoClousureMethod
    });

    const result = createClousure(NoClousureMethod);

    expect(result.isEmpty()).toBe(true);
  });
});

describe('createClousures', () => {
  it('should create multiple clousures from tokens', () => {
    const fn1 = vi.fn();
    const fn2 = vi.fn();

    const clousures = createClousures([fn1, fn2]);

    expect(clousures).toHaveLength(2);
  });

  it('should filter out empty results', () => {
    class NoClousure {}

    registerClousure(NoClousure);
    registerInjectable({
      scopeable: false,
      singleton: false,
      token: NoClousure
    });

    const clousures = createClousures([NoClousure]);

    expect(clousures).toHaveLength(0);
  });
});
