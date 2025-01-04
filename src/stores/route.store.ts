import { SecureMap } from '@rolster/commons';
import { RouteOptions } from '../types';

type Routes = Map<string, RouteOptions>;
type Controllers = SecureMap<Routes, Function>;

class RoutesManager {
  private controllers: Controllers;

  constructor() {
    this.controllers = new SecureMap(() => new Map());
  }

  public register(controller: Function, options: RouteOptions): void {
    const routes = this.controllers.request(controller);

    routes.set(`${options.http}:${options.path}`, options);
  }

  public request(controller: Function): RouteOptions[] {
    return Array.from(this.controllers.request(controller).values());
  }
}

const routes = new RoutesManager();

export function registerRoutes(
  controller: Function,
  options: RouteOptions
): void {
  routes.register(controller, options);
}

export function requestRoutes(controller: Function): RouteOptions[] {
  return routes.request(controller);
}
