import { RouteOptions } from '../types';

type RouteIndex = Map<string, RouteOptions>;
type ControllerIndex = Map<Function, RouteIndex>;

class RouteStore {
  private collection: ControllerIndex = new Map();

  public push(controller: Function, config: RouteOptions): void {
    const indexs = this.requestRouteIndex(controller);

    const { http, path } = config;

    indexs.set(`${http}:${path}`, config);
  }

  public request(controller: Function): RouteOptions[] {
    return Array.from(this.requestRouteIndex(controller).values());
  }

  private requestRouteIndex(controller: Function): RouteIndex {
    const current = this.collection.get(controller);

    if (current) {
      return current;
    }

    const indexs = new Map<string, RouteOptions>();

    this.collection.set(controller, indexs);

    return indexs;
  }
}

export const routesStore = new RouteStore();
