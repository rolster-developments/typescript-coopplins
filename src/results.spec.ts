import { HttpCode } from './enums';
import {
  resultBadRequest,
  resultDomainError,
  resultForbidden,
  resultInternalServerError,
  resultNotFound,
  resultSuccessful,
  resultUnauthorized
} from './results';
import { Result } from './types';

describe('resultSuccessful', () => {
  it('should return a success Result with data', () => {
    const result = resultSuccessful({ id: 1 });

    expect(result).toBeInstanceOf(Result);

    result.when({
      success: (data) => {
        expect(data).toEqual({ id: 1 });
      },
      failure: () => {
        throw new Error('Expected success');
      }
    });
  });
});

describe('resultBadRequest', () => {
  it('should return a failure Result with 400 code', () => {
    const result = resultBadRequest('invalid');

    result.when({
      success: () => {
        throw new Error('Expected failure');
      },
      failure: ({ statusCode, data }) => {
        expect(statusCode).toBe(HttpCode.BadRequest);
        expect(data).toBe('invalid');
      }
    });
  });
});

describe('resultUnauthorized', () => {
  it('should return a failure Result with 401 code', () => {
    const result = resultUnauthorized('no auth');

    result.when({
      success: () => {
        throw new Error('Expected failure');
      },
      failure: ({ statusCode, data }) => {
        expect(statusCode).toBe(HttpCode.Unauthorized);
        expect(data).toBe('no auth');
      }
    });
  });
});

describe('resultForbidden', () => {
  it('should return a failure Result with 403 code', () => {
    const result = resultForbidden('forbidden');

    result.when({
      success: () => {
        throw new Error('Expected failure');
      },
      failure: ({ statusCode, data }) => {
        expect(statusCode).toBe(HttpCode.Forbidden);
        expect(data).toBe('forbidden');
      }
    });
  });
});

describe('resultNotFound', () => {
  it('should return a failure Result with 404 code', () => {
    const result = resultNotFound('missing');

    result.when({
      success: () => {
        throw new Error('Expected failure');
      },
      failure: ({ statusCode, data }) => {
        expect(statusCode).toBe(HttpCode.NotFound);
        expect(data).toBe('missing');
      }
    });
  });
});

describe('resultDomainError', () => {
  it('should return a failure Result with 422 code', () => {
    const result = resultDomainError('domain');

    result.when({
      success: () => {
        throw new Error('Expected failure');
      },
      failure: ({ statusCode, data }) => {
        expect(statusCode).toBe(HttpCode.UnprocessableDomain);
        expect(data).toBe('domain');
      }
    });
  });
});

describe('resultInternalServerError', () => {
  it('should return a failure Result with 500 code', () => {
    const result = resultInternalServerError('crash');

    result.when({
      success: () => {
        throw new Error('Expected failure');
      },
      failure: ({ statusCode, data }) => {
        expect(statusCode).toBe(HttpCode.InternalServerError);
        expect(data).toBe('crash');
      }
    });
  });
});
