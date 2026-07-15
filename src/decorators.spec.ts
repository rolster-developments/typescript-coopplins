import { Body, Header, HeaderBool, HeaderNumber, Inject, Path, PathBool, PathNumber, Query, QueryBool, QueryNumber } from './decorators/arguments.decorator';
import { Clousure } from './decorators/closing.decorator';
import { Controller } from './decorators/controller.decorator';
import { LambdaDelete, LambdaGet, LambdaPatch, LambdaPost, LambdaPut } from './decorators/lambda.decorator';
import { Middleware } from './decorators/middleware.decorator';
import { Delete, Get, Options, Patch, Post, Put } from './decorators/route.decorator';
import { Arguments, HttpMethod } from './enums';
import { requestController } from './stores/controller.store';
import { requestRoutes } from './stores/route.store';
import { requestLambda } from './stores/lambda.store';
import { requestArgument } from './stores/arguments.store';
import { existsClousure } from './stores/clousure.store';
import { existsMiddleware } from './stores/middlerare.store';

describe('@Controller', () => {
  it('should register controller with basePath and middlewares', () => {
    @Controller('/api', [() => {}])
    class TestController {}

    const result = requestController(TestController);
    expect(result.isPresent()).toBe(true);
    expect(result.get().basePath).toBe('/api');
    expect(result.get().middlewares).toHaveLength(1);
  });

  it('should use defaults when no arguments provided', () => {
    @Controller()
    class TestController {}

    const result = requestController(TestController);
    expect(result.isPresent()).toBe(true);
    expect(result.get().basePath).toBe('/');
    expect(result.get().middlewares).toEqual([]);
  });
});

describe('@Get', () => {
  it('should register a GET route', () => {
    class TestController {
      @Get('/items')
      public list() {}
    }

    const routes = requestRoutes(TestController);
    expect(routes).toHaveLength(1);
    expect(routes[0].http).toBe(HttpMethod.Get);
    expect(routes[0].path).toBe('/items');
    expect(routes[0].key).toBe('list');
  });

  it('should use default path "/"', () => {
    class TestController {
      @Get()
      public list() {}
    }

    const routes = requestRoutes(TestController);
    expect(routes[0].path).toBe('/');
  });
});

describe('@Post', () => {
  it('should register a POST route', () => {
    class TestController {
      @Post('/create')
      public create() {}
    }

    const routes = requestRoutes(TestController);
    expect(routes[0].http).toBe(HttpMethod.Post);
    expect(routes[0].path).toBe('/create');
  });
});

describe('@Put', () => {
  it('should register a PUT route', () => {
    class TestController {
      @Put('/update')
      public update() {}
    }

    const routes = requestRoutes(TestController);
    expect(routes[0].http).toBe(HttpMethod.Put);
    expect(routes[0].path).toBe('/update');
  });
});

describe('@Delete', () => {
  it('should register a DELETE route', () => {
    class TestController {
      @Delete('/remove')
      public remove() {}
    }

    const routes = requestRoutes(TestController);
    expect(routes[0].http).toBe(HttpMethod.Delete);
    expect(routes[0].path).toBe('/remove');
  });
});

describe('@Patch', () => {
  it('should register a PATCH route', () => {
    class TestController {
      @Patch('/modify')
      public modify() {}
    }

    const routes = requestRoutes(TestController);
    expect(routes[0].http).toBe(HttpMethod.Patch);
    expect(routes[0].path).toBe('/modify');
  });
});

describe('@Options', () => {
  it('should register an OPTIONS route', () => {
    class TestController {
      @Options('/check')
      public check() {}
    }

    const routes = requestRoutes(TestController);
    expect(routes[0].http).toBe(HttpMethod.Options);
    expect(routes[0].path).toBe('/check');
  });
});

describe('@Body', () => {
  it('should register a body argument', () => {
    class TestController {
      public execute(@Body('data') _data: any) {}
    }

    const args = requestArgument(TestController, 'execute');
    expect(args).toHaveLength(1);
    expect(args[0].type).toBe(Arguments.Body);
    expect(args[0].key).toBe('data');
  });
});

describe('@Header', () => {
  it('should register a header argument', () => {
    class TestController {
      public execute(@Header('authorization') _auth: string) {}
    }

    const args = requestArgument(TestController, 'execute');
    expect(args[0].type).toBe(Arguments.Header);
    expect(args[0].key).toBe('authorization');
  });
});

describe('@HeaderBool', () => {
  it('should register a header argument with boolean dataType', () => {
    class TestController {
      public execute(@HeaderBool('x-flag') _flag: boolean) {}
    }

    const args = requestArgument(TestController, 'execute');
    expect(args[0].dataType).toBe('boolean');
  });
});

describe('@HeaderNumber', () => {
  it('should register a header argument with number dataType', () => {
    class TestController {
      public execute(@HeaderNumber('x-count') _count: number) {}
    }

    const args = requestArgument(TestController, 'execute');
    expect(args[0].dataType).toBe('number');
  });
});

describe('@Path', () => {
  it('should register a path argument', () => {
    class TestController {
      public execute(@Path('id') _id: string) {}
    }

    const args = requestArgument(TestController, 'execute');
    expect(args[0].type).toBe(Arguments.Path);
    expect(args[0].key).toBe('id');
  });
});

describe('@PathBool', () => {
  it('should register a path argument with boolean dataType', () => {
    class TestController {
      public execute(@PathBool('active') _active: boolean) {}
    }

    const args = requestArgument(TestController, 'execute');
    expect(args[0].dataType).toBe('boolean');
  });
});

describe('@PathNumber', () => {
  it('should register a path argument with number dataType', () => {
    class TestController {
      public execute(@PathNumber('id') _id: number) {}
    }

    const args = requestArgument(TestController, 'execute');
    expect(args[0].dataType).toBe('number');
  });
});

describe('@Query', () => {
  it('should register a query argument', () => {
    class TestController {
      public execute(@Query('page') _page: string) {}
    }

    const args = requestArgument(TestController, 'execute');
    expect(args[0].type).toBe(Arguments.Query);
    expect(args[0].key).toBe('page');
  });
});

describe('@QueryBool', () => {
  it('should register a query argument with boolean dataType', () => {
    class TestController {
      public execute(@QueryBool('active') _active: boolean) {}
    }

    const args = requestArgument(TestController, 'execute');
    expect(args[0].dataType).toBe('boolean');
  });
});

describe('@QueryNumber', () => {
  it('should register a query argument with number dataType', () => {
    class TestController {
      public execute(@QueryNumber('page') _page: number) {}
    }

    const args = requestArgument(TestController, 'execute');
    expect(args[0].dataType).toBe('number');
  });
});

describe('@Inject', () => {
  it('should register an inject argument', () => {
    class TestController {
      public execute(@Inject('MyService') _svc: any) {}
    }

    const args = requestArgument(TestController, 'execute');
    expect(args[0].type).toBe(Arguments.Inject);
    expect(args[0].token).toBe('MyService');
  });
});

describe('@Middleware', () => {
  it('should register a middleware class and its injectable', () => {
    @Middleware()
    class TestMiddleware {}

    expect(existsMiddleware(TestMiddleware)).toBe(true);
  });

  it('should accept scopeable and singleton options', () => {
    @Middleware({ scopeable: true, singleton: false })
    class TestMiddleware {}

    expect(existsMiddleware(TestMiddleware)).toBe(true);
  });
});

describe('@Clousure', () => {
  it('should register a clousure class and its injectable', () => {
    @Clousure()
    class TestClousure {}

    expect(existsClousure(TestClousure)).toBe(true);
  });

  it('should accept scopeable and singleton options', () => {
    @Clousure({ scopeable: true, singleton: true })
    class TestClousure {}

    expect(existsClousure(TestClousure)).toBe(true);
  });
});

describe('@LambdaPost', () => {
  it('should register a lambda with POST method', () => {
    @LambdaPost('/post-endpoint')
    class TestLambda {
      public execute() {}
    }

    const result = requestLambda(TestLambda);
    expect(result.isPresent()).toBe(true);
    expect(result.get().http).toBe(HttpMethod.Post);
    expect(result.get().path).toBe('/post-endpoint');
  });
});

describe('@LambdaGet', () => {
  it('should register a lambda with GET method', () => {
    @LambdaGet('/get-endpoint')
    class TestLambda {
      public execute() {}
    }

    const result = requestLambda(TestLambda);
    expect(result.get().http).toBe(HttpMethod.Get);
  });
});

describe('@LambdaPut', () => {
  it('should register a lambda with PUT method', () => {
    @LambdaPut('/put-endpoint')
    class TestLambda {
      public execute() {}
    }

    const result = requestLambda(TestLambda);
    expect(result.get().http).toBe(HttpMethod.Put);
  });
});

describe('@LambdaDelete', () => {
  it('should register a lambda with DELETE method', () => {
    @LambdaDelete('/delete-endpoint')
    class TestLambda {
      public execute() {}
    }

    const result = requestLambda(TestLambda);
    expect(result.get().http).toBe(HttpMethod.Delete);
  });
});

describe('@LambdaPatch', () => {
  it('should register a lambda with PATCH method', () => {
    @LambdaPatch('/patch-endpoint')
    class TestLambda {
      public execute() {}
    }

    const result = requestLambda(TestLambda);
    expect(result.get().http).toBe(HttpMethod.Patch);
  });
});
