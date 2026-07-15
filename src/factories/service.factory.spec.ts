import { Request, Response } from 'express';

import { HttpCode } from '../enums';
import { CoopplinsError } from '../exceptions';
import { createService } from './service.factory';
import { Result } from '../types';

function mockReqRes() {
  const json = vi.fn();
  const status = vi.fn(() => ({ json }));
  const request = {} as unknown as Request;
  const response = { status, json } as unknown as Response;
  return { json, request, response, status };
}

describe('createService', () => {
  it('should respond with 200 for a plain value', async () => {
    const { request, response, status, json } = mockReqRes();

    const handler = createService({
      service: () => ({ message: 'ok' })
    });

    await handler(request, response);

    expect(status).toHaveBeenCalledWith(HttpCode.Ok);
    expect(json).toHaveBeenCalledWith({ message: 'ok' });
  });

  it('should respond with custom status code for success Result', async () => {
    const { request, response, status, json } = mockReqRes();

    const handler = createService({
      service: () => Promise.resolve(Result.success({ id: 1 })),
      statusCode: HttpCode.Created
    });

    await handler(request, response);

    expect(status).toHaveBeenCalledWith(HttpCode.Created);
    expect(json).toHaveBeenCalledWith({ id: 1 });
  });

  it('should respond with failure status for failure Result', async () => {
    const { request, response, status, json } = mockReqRes();

    const handler = createService({
      service: () => Promise.resolve(Result.failure({ statusCode: 400, data: 'bad' }))
    });

    await handler(request, response);

    expect(status).toHaveBeenCalledWith(400);
    expect(json).toHaveBeenCalledWith('bad');
  });

  it('should handle CoopplinsError thrown from async service', async () => {
    const { request, response, status, json } = mockReqRes();

    const handler = createService({
      service: () =>
        Promise.reject(new CoopplinsError(404, 'Not Found', { id: 1 }))
    });

    await handler(request, response);

    expect(status).toHaveBeenCalledWith(404);
    expect(json).toHaveBeenCalledWith({
      message: 'Not Found',
      data: { id: 1 }
    });
  });

  it('should handle generic errors from async service', async () => {
    const { request, response, status, json } = mockReqRes();

    const handler = createService({
      service: () => Promise.reject(new Error('unexpected'))
    });

    await handler(request, response);

    expect(status).toHaveBeenCalledWith(500);
    expect(json).toHaveBeenCalledWith({
      message: 'An error occurred during the execution of the process'
    });
  });

  it('should call catchError when provided', async () => {
    const { request, response, status, json } = mockReqRes();
    const catchError = vi.fn();

    const handler = createService({
      service: () => Promise.reject(new Error('error')),
      catchError
    });

    await handler(request, response);

    expect(catchError).toHaveBeenCalled();
    expect(status).toHaveBeenCalledWith(500);
  });

  it('should call clousures after successful response', async () => {
    const { request, response } = mockReqRes();
    const clousure = vi.fn();

    const handler = createService({
      service: () => 'data',
      clousures: [clousure]
    });

    await handler(request, response);

    expect(clousure).toHaveBeenCalledWith(request, response);
  });

  it('should not break if clousure throws', async () => {
    const { request, response, status } = mockReqRes();

    const handler = createService({
      service: () => 'data',
      clousures: [
        () => {
          throw new Error('clousure error');
        }
      ]
    });

    await handler(request, response);

    expect(status).toHaveBeenCalledWith(HttpCode.Ok);
  });
});
