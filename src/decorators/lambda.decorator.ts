import { registerInjectable } from '@rolster/invertly';
import { HttpMethod } from '../enums';
import { registerLambda } from '../stores';
import { LambdaOptions, MiddlewareToken } from '../types';

function createLambda(props: LambdaOptions): ClassDecorator {
  return (token) => {
    registerLambda(token, props);

    registerInjectable({
      scopeable: true,
      singleton: false,
      token
    });
  };
}

export function LambdaPost(
  path = '/',
  middlewares: MiddlewareToken[] = []
): ClassDecorator {
  return createLambda({ path, middlewares, http: HttpMethod.Post });
}

export function LambdaGet(
  path = '/',
  middlewares: MiddlewareToken[] = []
): ClassDecorator {
  return createLambda({ path, middlewares, http: HttpMethod.Get });
}

export function LambdaPut(
  path = '/',
  middlewares: MiddlewareToken[] = []
): ClassDecorator {
  return createLambda({ path, middlewares, http: HttpMethod.Put });
}

export function LambdaDelete(
  path = '/',
  middlewares: MiddlewareToken[] = []
): ClassDecorator {
  return createLambda({ path, middlewares, http: HttpMethod.Delete });
}

export function LambdaPatch(
  path = '/',
  middlewares: MiddlewareToken[] = []
): ClassDecorator {
  return createLambda({ path, middlewares, http: HttpMethod.Patch });
}
