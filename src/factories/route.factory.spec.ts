import { Router } from 'express';

import { HttpMethod } from '../enums';
import { createRoute } from './route.factory';

describe('createRoute', () => {
  it('should return the router method bound to the router', () => {
    const router = Router();
    const getSpy = vi.spyOn(router, 'get');

    const route = createRoute(router, HttpMethod.Get);

    route('/test', [() => {}]);

    expect(getSpy).toHaveBeenCalledWith('/test', [expect.any(Function)]);
  });

  it('should work with post method', () => {
    const router = Router();
    const postSpy = vi.spyOn(router, 'post');

    const route = createRoute(router, HttpMethod.Post);

    route('/test', [() => {}]);

    expect(postSpy).toHaveBeenCalled();
  });

  it('should work with put method', () => {
    const router = Router();
    const putSpy = vi.spyOn(router, 'put');

    const route = createRoute(router, HttpMethod.Put);

    route('/test', [() => {}]);

    expect(putSpy).toHaveBeenCalled();
  });

  it('should work with delete method', () => {
    const router = Router();
    const deleteSpy = vi.spyOn(router, 'delete');

    const route = createRoute(router, HttpMethod.Delete);

    route('/test', [() => {}]);

    expect(deleteSpy).toHaveBeenCalled();
  });
});
