import { Context } from '@rolster/invertly';

const KEY = 'rolster_context';

export function getContextFromRequest(
  request: LiteralObject
): Undefined<Context> {
  const context = request[KEY];

  return context instanceof Context ? context : undefined;
}

export function setContextForRequest(
  request: LiteralObject,
  context: Context
): void {
  request[KEY] = context;
}

export function createContextForRequest(request: LiteralObject): Context {
  const currentContext = getContextFromRequest(request);

  if (currentContext) {
    return currentContext;
  }

  const context = new Context();

  setContextForRequest(request, context);

  return context;
}
