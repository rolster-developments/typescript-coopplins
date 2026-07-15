import { Optional } from '@rolster/commons';
import { ControllerOptions } from '../types';

class Controllers {
  private collection: Map<Function, ControllerOptions> = new Map();

  public register(controller: Function, options: ControllerOptions): void {
    this.collection.set(controller, options);
  }

  public request(controller: Function): Optional<ControllerOptions> {
    return Optional.build(this.collection.get(controller));
  }
}

const controllers = new Controllers();

export function registerController(
  controller: Function,
  options: ControllerOptions
): void {
  controllers.register(controller, options);
}

export function requestController(
  controller: Function
): Optional<ControllerOptions> {
  return controllers.request(controller);
}
