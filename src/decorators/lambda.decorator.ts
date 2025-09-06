import { registerInjectable } from '@rolster/invertly';
import { HttpCode, HttpMethod } from '../enums';
import { registerLambda } from '../stores/lambda.store';
import { LambdaOptions, MiddlewareToken } from '../types';

function createLambda(options: LambdaOptions): ClassDecorator {
  return (token) => {
    registerLambda(token, options);

    registerInjectable({
      scopeable: true,
      singleton: false,
      token
    });
  };
}

export function LambdaPost(
  path = '/',
  middlewares: MiddlewareToken[] = [],
  statusCode = HttpCode.Ok
): ClassDecorator {
  return createLambda({
    http: HttpMethod.Post,
    middlewares,
    path,
    statusCode
  });
}

export function LambdaGet(
  path = '/',
  middlewares: MiddlewareToken[] = [],
  statusCode = HttpCode.Ok
): ClassDecorator {
  return createLambda({
    http: HttpMethod.Get,
    middlewares,
    path,
    statusCode
  });
}

export function LambdaPut(
  path = '/',
  middlewares: MiddlewareToken[] = [],
  statusCode = HttpCode.Ok
): ClassDecorator {
  return createLambda({
    http: HttpMethod.Put,
    middlewares,
    path,
    statusCode
  });
}

export function LambdaDelete(
  path = '/',
  middlewares: MiddlewareToken[] = [],
  statusCode = HttpCode.Ok
): ClassDecorator {
  return createLambda({
    http: HttpMethod.Delete,
    middlewares,
    path,
    statusCode
  });
}

export function LambdaPatch(
  path = '/',
  middlewares: MiddlewareToken[] = [],
  statusCode = HttpCode.Ok
): ClassDecorator {
  return createLambda({
    http: HttpMethod.Patch,
    middlewares,
    path,
    statusCode
  });
}
