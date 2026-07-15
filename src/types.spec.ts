import { Result } from './types';

describe('Result', () => {
  describe('success', () => {
    it('should create a successful result', () => {
      const result = Result.success('data');

      expect(result).toBeInstanceOf(Result);
    });

    it('should execute success branch via when', () => {
      const result = Result.success('data');
      const successFn = vi.fn();
      const failureFn = vi.fn();

      result.when({ success: successFn, failure: failureFn });

      expect(successFn).toHaveBeenCalledWith('data');
      expect(failureFn).not.toHaveBeenCalled();
    });

    it('should work with undefined value', () => {
      const result = Result.success();
      const successFn = vi.fn();

      result.when({ success: successFn, failure: () => {} });

      expect(successFn).toHaveBeenCalledWith(undefined);
    });
  });

  describe('failure', () => {
    it('should create a failure result', () => {
      const result = Result.failure({ statusCode: 400, data: 'error' });

      expect(result).toBeInstanceOf(Result);
    });

    it('should execute failure branch via when', () => {
      const failureData = { statusCode: 400, data: 'error' };
      const result = Result.failure(failureData);
      const successFn = vi.fn();
      const failureFn = vi.fn();

      result.when({ success: successFn, failure: failureFn });

      expect(successFn).not.toHaveBeenCalled();
      expect(failureFn).toHaveBeenCalledWith(failureData);
    });
  });

  describe('when', () => {
    it('should return the value from the matched branch', () => {
      const successResult = Result.success('ok');
      const failureResult = Result.failure('fail');

      const successValue = successResult.when({
        success: (v) => `success:${v}`,
        failure: (v) => `failure:${v}`
      });

      const failureValue = failureResult.when({
        success: (v) => `success:${v}`,
        failure: (v) => `failure:${v}`
      });

      expect(successValue).toBe('success:ok');
      expect(failureValue).toBe('failure:fail');
    });
  });
});
