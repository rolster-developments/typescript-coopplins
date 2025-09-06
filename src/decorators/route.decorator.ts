import { HttpMethod } from '../enums';
import { registerRoutes } from '../stores/route.store';
import { MiddlewareToken } from '../types';

interface RouteOptions {
  http: HttpMethod;
  middlewares: MiddlewareToken[];
  path: string;
  statusCode?: number;
}

type Options = Omit<RouteOptions, 'http' | 'path'>;
type HttpOptions = Partial<Options>;

const DEFAULT_OPTIONS: Options = {
  middlewares: []
};

function createRoute(options: RouteOptions): MethodDecorator {
  return ({ constructor }, key) => {
    registerRoutes(constructor, { ...options, key });
  };
}

export function Post(path = '/', options?: HttpOptions): MethodDecorator {
  return createRoute({
    ...DEFAULT_OPTIONS,
    ...options,
    path,
    http: HttpMethod.Post
  });
}

export function Get(path = '/', options?: HttpOptions): MethodDecorator {
  return createRoute({
    ...DEFAULT_OPTIONS,
    ...options,
    path,
    http: HttpMethod.Get
  });
}

export function Put(path = '/', options?: HttpOptions): MethodDecorator {
  return createRoute({
    ...DEFAULT_OPTIONS,
    ...options,
    path,
    http: HttpMethod.Put
  });
}

export function Delete(path = '/', options?: HttpOptions): MethodDecorator {
  return createRoute({
    ...DEFAULT_OPTIONS,
    ...options,
    path,
    http: HttpMethod.Delete
  });
}

export function Patch(path = '/', options?: HttpOptions): MethodDecorator {
  return createRoute({
    ...DEFAULT_OPTIONS,
    ...options,
    path,
    http: HttpMethod.Patch
  });
}

export function Options(path = '/', options?: HttpOptions): MethodDecorator {
  return createRoute({
    ...DEFAULT_OPTIONS,
    ...options,
    path,
    http: HttpMethod.Options
  });
}
