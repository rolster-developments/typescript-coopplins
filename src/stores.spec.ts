import {
  registerController,
  requestController
} from './stores/controller.store';
import {
  registerRoutes,
  requestRoutes
} from './stores/route.store';
import {
  registerLambda,
  requestLambda
} from './stores/lambda.store';
import {
  registerArgument,
  requestArgument
} from './stores/arguments.store';
import {
  existsClousure,
  registerClousure
} from './stores/clousure.store';
import {
  existsMiddleware,
  registerMiddleware
} from './stores/middlerare.store';
import { HttpMethod } from './enums';
import { Arguments } from './enums';

describe('controller.store', () => {
  it('should register and request a controller', () => {
    const controller = class TestController {};
    const options = { basePath: '/api', middlewares: [] };

    registerController(controller, options);

    const result = requestController(controller);
    expect(result.isPresent()).toBe(true);
    expect(result.get()).toEqual(options);
  });

  it('should return empty Optional for unregistered controller', () => {
    const controller = class UnknownController {};

    const result = requestController(controller);
    expect(result.isEmpty()).toBe(true);
  });
});

describe('route.store', () => {
  it('should register and request routes for a controller', () => {
    const controller = class TestController {};

    registerRoutes(controller, {
      http: HttpMethod.Get,
      key: 'list',
      middlewares: [],
      path: '/list'
    });

    registerRoutes(controller, {
      http: HttpMethod.Post,
      key: 'create',
      middlewares: [],
      path: '/create'
    });

    const routes = requestRoutes(controller);
    expect(routes).toHaveLength(2);
  });

  it('should deduplicate routes with same http:path', () => {
    const controller = class TestController {};

    registerRoutes(controller, {
      http: HttpMethod.Get,
      key: 'list',
      middlewares: [],
      path: '/list'
    });

    registerRoutes(controller, {
      http: HttpMethod.Get,
      key: 'list',
      middlewares: [],
      path: '/list'
    });

    const routes = requestRoutes(controller);
    expect(routes).toHaveLength(1);
  });

  it('should return empty array for unregistered controller', () => {
    const controller = class UnknownController {};

    expect(requestRoutes(controller)).toEqual([]);
  });
});

describe('lambda.store', () => {
  it('should register and request a lambda', () => {
    const lambda = class TestLambda {};

    registerLambda(lambda, {
      http: HttpMethod.Get,
      middlewares: [],
      path: '/test'
    });

    const result = requestLambda(lambda);
    expect(result.isPresent()).toBe(true);
    expect(result.get()).toMatchObject({
      http: HttpMethod.Get,
      path: '/test'
    });
  });

  it('should return empty Optional for unregistered lambda', () => {
    const lambda = class UnknownLambda {};

    expect(requestLambda(lambda).isEmpty()).toBe(true);
  });
});

describe('arguments.store', () => {
  it('should register and request arguments', () => {
    const controller = class TestController {};

    registerArgument(controller, {
      index: 0,
      name: 'execute',
      type: Arguments.Body,
      key: 'data'
    });

    registerArgument(controller, {
      index: 1,
      name: 'execute',
      type: Arguments.Header,
      key: 'authorization'
    });

    const args = requestArgument(controller, 'execute');
    expect(args).toHaveLength(2);
    expect(args[0].type).toBe(Arguments.Body);
    expect(args[0].key).toBe('data');
    expect(args[1].type).toBe(Arguments.Header);
    expect(args[1].key).toBe('authorization');
  });

  it('should return empty array for unregistered controller', () => {
    const controller = class UnknownController {};

    expect(requestArgument(controller, 'execute')).toEqual([]);
  });
});

describe('clousure.store', () => {
  it('should register and check existence of a clousure', () => {
    const clousure = class TestClousure {};

    expect(existsClousure(clousure)).toBe(false);

    registerClousure(clousure);

    expect(existsClousure(clousure)).toBe(true);
  });
});

describe('middleware.store', () => {
  it('should register and check existence of a middleware', () => {
    const middleware = class TestMiddleware {};

    expect(existsMiddleware(middleware)).toBe(false);

    registerMiddleware(middleware);

    expect(existsMiddleware(middleware)).toBe(true);
  });
});
