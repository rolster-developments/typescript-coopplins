import { HttpMethod } from '../enums';
import { routesStore } from '../stores';
import { MiddlewareToken } from '../types';

interface RouteOptions {
  http: HttpMethod;
  middlewares: MiddlewareToken[];
  path: string;
}

type Options = Omit<RouteOptions, 'http' | 'path'>;
type HttpOptions = Partial<Options>;

const DEFAULT_CONFIG: Options = {
  middlewares: []
};

function createRoute(options: RouteOptions): MethodDecorator {
  const { http, middlewares, path } = options;

  return ({ constructor }, key) => {
    routesStore.push(constructor, { http, key, middlewares, path });
  };
}

export function Post(path = '/', options?: HttpOptions): MethodDecorator {
  return createRoute({
    ...DEFAULT_CONFIG,
    ...options,
    path,
    http: HttpMethod.Post
  });
}

export function Get(path = '/', options?: HttpOptions): MethodDecorator {
  return createRoute({
    ...DEFAULT_CONFIG,
    ...options,
    path,
    http: HttpMethod.Get
  });
}

export function Put(path = '/', options?: HttpOptions): MethodDecorator {
  return createRoute({
    ...DEFAULT_CONFIG,
    ...options,
    path,
    http: HttpMethod.Put
  });
}

export function Delete(path = '/', options?: HttpOptions): MethodDecorator {
  return createRoute({
    ...DEFAULT_CONFIG,
    ...options,
    path,
    http: HttpMethod.Delete
  });
}

export function Patch(path = '/', options?: HttpOptions): MethodDecorator {
  return createRoute({
    ...DEFAULT_CONFIG,
    ...options,
    path,
    http: HttpMethod.Patch
  });
}

export function Options(path = '/', options?: HttpOptions): MethodDecorator {
  return createRoute({
    ...DEFAULT_CONFIG,
    ...options,
    path,
    http: HttpMethod.Options
  });
}
