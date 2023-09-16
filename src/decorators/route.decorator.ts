import { routes } from '../stores';
import { Http, MiddlewareToken } from '../types';

interface HttpProps {
  http: Http;
  middlewares: MiddlewareToken[];
  path: string;
}

type HttpConfig = Omit<HttpProps, 'http' | 'path'>;
type Config = Partial<HttpConfig>;

const DEFAULT_CONFIG: HttpConfig = {
  middlewares: []
};

const createRoute = (props: HttpProps): MethodDecorator => {
  const { http, middlewares, path } = props;

  return ({ constructor }, key) => {
    routes.push(constructor, { http, key, middlewares, path });
  };
};

export const Post = (path = '/', config?: Config): MethodDecorator => {
  return createRoute({
    ...DEFAULT_CONFIG,
    ...config,
    path,
    http: Http.Post
  });
};

export const Get = (path = '/', config?: Config): MethodDecorator => {
  return createRoute({
    ...DEFAULT_CONFIG,
    ...config,
    path,
    http: Http.Get
  });
};

export const Put = (path = '/', config?: Config): MethodDecorator => {
  return createRoute({
    ...DEFAULT_CONFIG,
    ...config,
    path,
    http: Http.Put
  });
};

export const Delete = (path = '/', config?: Config): MethodDecorator => {
  return createRoute({
    ...DEFAULT_CONFIG,
    ...config,
    path,
    http: Http.Delete
  });
};

export const Patch = (path = '/', config?: Config): MethodDecorator => {
  return createRoute({
    ...DEFAULT_CONFIG,
    ...config,
    path,
    http: Http.Patch
  });
};

export const Options = (path = '/', config?: Config): MethodDecorator => {
  return createRoute({
    ...DEFAULT_CONFIG,
    ...config,
    path,
    http: Http.Options
  });
};
