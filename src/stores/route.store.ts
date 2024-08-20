import { RouteOptions } from '../types';

type RoutesMap = Map<string, RouteOptions>;
type Controllers = Map<Function, RoutesMap>;

class Routes {
  private controllers: Controllers = new Map();

  public register(controller: Function, options: RouteOptions): void {
    const indexs = this.requestRoutesForController(controller);

    const { http, path } = options;

    indexs.set(`${http}:${path}`, options);
  }

  public request(controller: Function): RouteOptions[] {
    return Array.from(this.requestRoutesForController(controller).values());
  }

  private requestRoutesForController(controller: Function): RoutesMap {
    const currentRoutes = this.controllers.get(controller);

    if (currentRoutes) {
      return currentRoutes;
    }

    const routes = new Map<string, RouteOptions>();

    this.controllers.set(controller, routes);

    return routes;
  }
}

const routes = new Routes();

export function registerRoutes(
  controller: Function,
  options: RouteOptions
): void {
  routes.register(controller, options);
}

export function requestRoutes(controller: Function): RouteOptions[] {
  return routes.request(controller);
}
