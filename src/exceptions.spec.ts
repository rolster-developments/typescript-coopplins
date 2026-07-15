import { HttpCode } from './enums';
import {
  BadRequestError,
  CoopplinsError,
  DomainError,
  ForbiddenError,
  InternalServerError,
  NotFoundError,
  UnauthorizedError
} from './exceptions';

describe('CoopplinsError', () => {
  it('should create an error with code, message, and data', () => {
    const error = new CoopplinsError(400, 'test message', { foo: 'bar' });

    expect(error).toBeInstanceOf(Error);
    expect(error.code).toBe(400);
    expect(error.message).toBe('test message');
    expect(error.data).toEqual({ foo: 'bar' });
  });

  it('should create an error without data', () => {
    const error = new CoopplinsError(500, 'server error');

    expect(error.data).toBeUndefined();
  });
});

describe('BadRequestError', () => {
  it('should have code 400', () => {
    const error = new BadRequestError('bad request');

    expect(error).toBeInstanceOf(CoopplinsError);
    expect(error.code).toBe(HttpCode.BadRequest);
    expect(error.message).toBe('bad request');
  });
});

describe('UnauthorizedError', () => {
  it('should have code 401', () => {
    const error = new UnauthorizedError('unauthorized');

    expect(error).toBeInstanceOf(CoopplinsError);
    expect(error.code).toBe(HttpCode.Unauthorized);
    expect(error.message).toBe('unauthorized');
  });
});

describe('ForbiddenError', () => {
  it('should have code 403', () => {
    const error = new ForbiddenError('forbidden');

    expect(error).toBeInstanceOf(CoopplinsError);
    expect(error.code).toBe(HttpCode.Forbidden);
    expect(error.message).toBe('forbidden');
  });
});

describe('NotFoundError', () => {
  it('should have code 404', () => {
    const error = new NotFoundError('not found');

    expect(error).toBeInstanceOf(CoopplinsError);
    expect(error.code).toBe(HttpCode.NotFound);
    expect(error.message).toBe('not found');
  });
});

describe('DomainError', () => {
  it('should have code 422', () => {
    const error = new DomainError('domain error');

    expect(error).toBeInstanceOf(CoopplinsError);
    expect(error.code).toBe(HttpCode.UnprocessableDomain);
    expect(error.message).toBe('domain error');
  });
});

describe('InternalServerError', () => {
  it('should have code 500', () => {
    const error = new InternalServerError('internal error');

    expect(error).toBeInstanceOf(CoopplinsError);
    expect(error.code).toBe(HttpCode.InternalServerError);
    expect(error.message).toBe('internal error');
  });
});
