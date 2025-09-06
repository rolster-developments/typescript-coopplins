import { Context } from '@rolster/invertly';

const key = 'context_rolster';

export function contextOfRequest<K = string>(
  request: LiteralObject
): Undefined<Context<K>> {
  return request[key] instanceof Context ? request[key] : undefined;
}

export function contextInRequest<K = string>(
  request: LiteralObject,
  context: Context<K>
): void {
  request[key] = context;
}

export function contextFromRequest<K = string>(
  request: LiteralObject
): Context<K> {
  let context = contextOfRequest<K>(request);

  if (!context) {
    context = new Context<K>();
    contextInRequest(request, context);
  }

  return context;
}
