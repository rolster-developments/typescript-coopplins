import { Request } from 'express';

import { Arguments } from '../enums';
import { createHttpArguments } from './argument.factory';
import { registerArgument } from '../stores/arguments.store';

describe('createHttpArguments', () => {
  class TestController {
    public execute() {}
    public create() {}
  }

  const controller = new TestController();

  it('should extract body argument', () => {
    registerArgument(TestController, {
      index: 0,
      name: 'execute',
      type: Arguments.Body,
      key: 'data'
    });

    const request = { body: { data: 'hello' } } as unknown as Request;

    const args = createHttpArguments(controller, 'execute', request);

    expect(args).toHaveLength(1);
    expect(args[0]).toBe('hello');
  });

  it('should extract full body when no key specified', () => {
    registerArgument(TestController, {
      index: 0,
      name: 'create',
      type: Arguments.Body
    });

    const request = { body: { foo: 'bar' } } as unknown as Request;

    const args = createHttpArguments(controller, 'create', request);

    expect(args[0]).toEqual({ foo: 'bar' });
  });

  it('should extract header argument', () => {
    registerArgument(TestController, {
      index: 0,
      name: 'execute',
      type: Arguments.Header,
      key: 'authorization',
      dataType: 'string'
    });

    const request = { headers: { authorization: 'Bearer token' } } as any;

    const args = createHttpArguments(controller, 'execute', request);

    expect(args[0]).toBe('Bearer token');
  });

  it('should extract path argument', () => {
    registerArgument(TestController, {
      index: 0,
      name: 'execute',
      type: Arguments.Path,
      key: 'id',
      dataType: 'number'
    });

    const request = { params: { id: '42' } } as any;

    const args = createHttpArguments(controller, 'execute', request);

    expect(args[0].valueOf()).toBe(42);
  });

  it('should extract query argument', () => {
    registerArgument(TestController, {
      index: 0,
      name: 'execute',
      type: Arguments.QueryParams,
      key: 'page',
      dataType: 'string'
    });

    const request = { query: { page: '1' } } as any;

    const args = createHttpArguments(controller, 'execute', request);

    expect(args[0]).toBe('1');
  });

  it('should parse boolean query parameter', () => {
    registerArgument(TestController, {
      index: 0,
      name: 'execute',
      type: Arguments.QueryParams,
      key: 'active',
      dataType: 'boolean'
    });

    const request = { query: { active: 'true' } } as any;

    const args = createHttpArguments(controller, 'execute', request);

    expect(args[0]).toBe(true);
  });

  it('should parse number query parameter', () => {
    registerArgument(TestController, {
      index: 0,
      name: 'execute',
      type: Arguments.QueryParams,
      key: 'count',
      dataType: 'number'
    });

    const request = { query: { count: '5' } } as any;

    const args = createHttpArguments(controller, 'execute', request);

    expect(args[0].valueOf()).toBe(5);
  });

  it('should return undefined for missing value', () => {
    registerArgument(TestController, {
      index: 0,
      name: 'execute',
      type: Arguments.Body,
      key: 'nonexistent'
    });

    const request = { body: {} } as unknown as Request;

    const args = createHttpArguments(controller, 'execute', request);

    expect(args[0]).toBeUndefined();
  });

  it('should return empty array when no arguments registered', () => {
    class EmptyController {
      public execute() {}
    }
    const instance = new EmptyController();

    const request = {} as unknown as Request;

    const args = createHttpArguments(instance, 'execute', request);

    expect(args).toEqual([]);
  });

  it('should return value as-is when dataType is undefined', () => {
    class TestController {
      public execute() {}
    }

    const controller = new TestController();

    registerArgument(TestController, {
      index: 0,
      name: 'execute',
      type: Arguments.Header,
      key: 'x-custom'
    });

    const request = { headers: { 'x-custom': 'raw-value' } } as any;

    const args = createHttpArguments(controller, 'execute', request);

    expect(args[0]).toBe('raw-value');
  });

  it('should return undefined when key is falsy', () => {
    class TestController {
      public execute() {}
    }

    const controller = new TestController();

    registerArgument(TestController, {
      index: 0,
      name: 'execute',
      type: Arguments.Header,
      key: ''
    });

    const request = { headers: { '': 'value' } } as any;

    const args = createHttpArguments(controller, 'execute', request);

    expect(args[0]).toBe('');
  });
});
