import { Arguments, HttpCode, HttpMethod } from './enums';

describe('Arguments', () => {
  it('should have correct values', () => {
    expect(Arguments.Body).toBe('body');
    expect(Arguments.Header).toBe('header');
    expect(Arguments.Path).toBe('path');
    expect(Arguments.QueryParams).toBe('queryParams');
    expect(Arguments.Inject).toBe('inject');
  });
});

describe('HttpCode', () => {
  it('should have correct status codes', () => {
    expect(HttpCode.Ok).toBe(200);
    expect(HttpCode.Created).toBe(201);
    expect(HttpCode.Accept).toBe(202);
    expect(HttpCode.NoContent).toBe(204);
    expect(HttpCode.BadRequest).toBe(400);
    expect(HttpCode.Unauthorized).toBe(401);
    expect(HttpCode.Forbidden).toBe(403);
    expect(HttpCode.NotFound).toBe(404);
    expect(HttpCode.Conflict).toBe(409);
    expect(HttpCode.Locked).toBe(423);
    expect(HttpCode.UnprocessableDomain).toBe(422);
    expect(HttpCode.InternalServerError).toBe(500);
  });
});

describe('HttpMethod', () => {
  it('should have correct HTTP methods', () => {
    expect(HttpMethod.Post).toBe('post');
    expect(HttpMethod.Query).toBe('query');
    expect(HttpMethod.Put).toBe('put');
    expect(HttpMethod.Patch).toBe('patch');
    expect(HttpMethod.Get).toBe('get');
    expect(HttpMethod.Delete).toBe('delete');
    expect(HttpMethod.Options).toBe('options');
  });
});
