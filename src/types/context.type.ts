import { Context } from '@rolster/invertly';

const KEY = 'rolsterContext';

export function requestContext(request: any): Undefined<Context> {
  return request[KEY] instanceof Context ? request[KEY] : undefined;
}

export function saveContext(request: any, context: Context): void {
  request[KEY] = context;
}

export function proxyContext(request: any): Context {
  const current = requestContext(request);

  if (current) {
    return current;
  }

  const context = new Context();

  saveContext(request, context);

  return context;
}
