import { Context } from '@rolster/invertly';

const KEY = 'rolster_context';

export function getContext(request: LiteralObject): Undefined<Context> {
  const context = request[KEY];

  return context instanceof Context ? context : undefined;
}

export function setContext(request: LiteralObject, context: Context): void {
  request[KEY] = context;
}

export function requestContext(request: LiteralObject): Context {
  const currentContext = getContext(request);

  if (currentContext) {
    return currentContext;
  }

  const context = new Context();

  setContext(request, context);

  return context;
}
