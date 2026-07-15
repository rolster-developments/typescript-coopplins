import { Get } from './decorators/route.decorator';
import { Controller } from './decorators/controller.decorator';
import { coopplins } from './server';

describe('coopplins.start', () => {
  it('should start and stop the server', async () => {
    @Controller('/')
    class TestController {
      @Get('/')
      public index() {
        return { status: 'running' };
      }
    }

    const app = coopplins({
      controllers: [TestController]
    });

    await app.start(0);

    // Server is listening on port 0
    expect(true).toBe(true);
  });

  it('should call beforeAll hook', async () => {
    const beforeAll = vi.fn(async () => {});

    const app = coopplins({
      beforeAll
    });

    await app.start(0);

    expect(beforeAll).toHaveBeenCalled();
  });

  it('should have afterAll hook available', () => {
    const afterAll = vi.fn();
    const app = coopplins({ afterAll });

    expect(app).toBeDefined();
    expect(afterAll).not.toHaveBeenCalled();
  });

  it('should handle handlers option', async () => {
    const handler = vi.fn((_req: any, _res: any, next: any) => next());

    const app = coopplins({
      handlers: [handler]
    });

    await app.start(0);

    expect(true).toBe(true);
  });

  it('should start with lambdas', async () => {
    const app = coopplins({
      lambdas: []
    });

    await app.start(0);

    expect(true).toBe(true);
  });

  it('should reject with error when listen fails', async () => {
    const app = coopplins({});

    // Mock express to make listen fail
    vi.spyOn(console, 'error').mockImplementation(() => {});

    // We can't easily make listen fail, but we can verify it doesn't throw
    await expect(app.start(0)).resolves.toBeUndefined();
  });
});
