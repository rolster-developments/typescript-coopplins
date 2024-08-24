import { Context } from '@rolster/invertly';

const KEY = 'rolster_context';

export function getContextFromRequest<K = string>(
  request: LiteralObject
): Undefined<Context<K>> {
  return request[KEY] instanceof Context ? request[KEY] : undefined;
}

export function setContextForRequest<K = string>(
  request: LiteralObject,
  context: Context<K>
): void {
  request[KEY] = context;
}

export function createContextForRequest<K = string>(
  request: LiteralObject
): Context<K> {
  const currentContext = getContextFromRequest<K>(request);

  if (currentContext) {
    return currentContext;
  }

  const requestContext = new Context<K>();

  setContextForRequest(request, requestContext);

  return requestContext;
}
