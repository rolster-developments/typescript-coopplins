import { Context, registerInjectable } from '@rolster/invertly';

import { Arguments } from '../enums';
import { createHttpArguments } from './argument.factory';
import { registerArgument } from '../stores/arguments.store';

describe('createHttpArguments - Inject', () => {
  it('should create an injected dependency from context', () => {
    class TestService {
      public greet() {
        return 'hello';
      }
    }

    class TestController {
      public execute() {}
    }

    registerInjectable({
      scopeable: false,
      singleton: false,
      token: TestService
    });

    registerArgument(TestController, {
      index: 0,
      name: 'execute',
      type: Arguments.Inject,
      token: TestService
    });

    const context = new Context();
    context.save('TestService', new TestService());

    const controller = new TestController();
    const request = { context_rolster: context } as any;

    const args = createHttpArguments(controller, 'execute', request);

    expect(args[0]).toBeInstanceOf(TestService);
  });

  it('should return undefined when no token specified', () => {
    class TestController {
      public execute() {}
    }

    registerArgument(TestController, {
      index: 0,
      name: 'execute',
      type: Arguments.Inject
    });

    const controller = new TestController();
    const request = {} as any;

    const args = createHttpArguments(controller, 'execute', request);

    expect(args[0]).toBeUndefined();
  });
});
