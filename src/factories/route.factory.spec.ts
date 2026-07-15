import { Router } from 'express';

import { HttpMethod } from '../enums';
import { routeAPI } from './route.factory';

describe('routeAPI', () => {
  it('should return the router method bound to the router', () => {
    const router = Router();
    const getSpy = vi.spyOn(router, 'get');

    const route = routeAPI(router, HttpMethod.Get);

    route('/test', [() => {}]);

    expect(getSpy).toHaveBeenCalledWith('/test', [expect.any(Function)]);
  });

  it('should work with post method', () => {
    const router = Router();
    const postSpy = vi.spyOn(router, 'post');

    const route = routeAPI(router, HttpMethod.Post);

    route('/test', [() => {}]);

    expect(postSpy).toHaveBeenCalled();
  });

  it('should work with put method', () => {
    const router = Router();
    const putSpy = vi.spyOn(router, 'put');

    const route = routeAPI(router, HttpMethod.Put);

    route('/test', [() => {}]);

    expect(putSpy).toHaveBeenCalled();
  });

  it('should work with delete method', () => {
    const router = Router();
    const deleteSpy = vi.spyOn(router, 'delete');

    const route = routeAPI(router, HttpMethod.Delete);

    route('/test', [() => {}]);

    expect(deleteSpy).toHaveBeenCalled();
  });
});
