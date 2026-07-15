import { coopplins, environment } from './server';

describe('coopplins', () => {
  it('should create a Coopplins instance', () => {
    const app = coopplins({});

    expect(app).toBeDefined();
    expect(app.start).toBeInstanceOf(Function);
  });
});

describe('environment', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.resetModules();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('should return the environment variable value', () => {
    process.env['MY_VAR'] = 'hello';

    const value = environment('MY_VAR');

    expect(value).toBe('hello');
  });

  it('should return undefined for missing variable', () => {
    const value = environment('NONEXISTENT');

    expect(value).toBeUndefined();
  });
});
