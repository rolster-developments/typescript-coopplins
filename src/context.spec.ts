import { Context } from '@rolster/invertly';

import {
  contextFromRequest,
  contextInRequest,
  contextOfRequest
} from './context';

describe('contextOfRequest', () => {
  it('should return the context when present on request', () => {
    const context = new Context<string>();
    const request = { context_rolster: context };

    expect(contextOfRequest(request)).toBe(context);
  });

  it('should return undefined when no context on request', () => {
    const request = {};

    expect(contextOfRequest(request)).toBeUndefined();
  });

  it('should return undefined when the key is not a Context instance', () => {
    const request = { context_rolster: 'not-a-context' };

    expect(contextOfRequest(request)).toBeUndefined();
  });
});

describe('contextInRequest', () => {
  it('should set the context on the request', () => {
    const context = new Context<string>();
    const request: Record<string, any> = {};

    contextInRequest(request, context);

    expect(request['context_rolster']).toBe(context);
  });
});

describe('contextFromRequest', () => {
  it('should return existing context when present', () => {
    const context = new Context<number>();
    const request = { context_rolster: context };

    expect(contextFromRequest(request)).toBe(context);
  });

  it('should create a new context when not present', () => {
    const request: Record<string, any> = {};

    const context = contextFromRequest(request);

    expect(context).toBeInstanceOf(Context);
    expect(request['context_rolster']).toBe(context);
  });
});
